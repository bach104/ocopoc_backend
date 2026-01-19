const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found in database',
          code: 'USER_NOT_FOUND'
        });
      }

      // Kiểm tra thêm: user có bị vô hiệu hóa không?
      // Có thể thêm trường 'active' vào model nếu cần

      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      
      let message = 'Not authorized, token failed';
      let code = 'TOKEN_INVALID';
      
      if (error.name === 'TokenExpiredError') {
        message = 'Token expired';
        code = 'TOKEN_EXPIRED';
      } else if (error.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        code = 'TOKEN_MALFORMED';
      }
      
      return res.status(401).json({ 
        success: false, 
        message,
        code
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token',
      code: 'NO_TOKEN'
    });
  }
};


const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as an admin'
    });
  }
};

const user = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as a user'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

module.exports = { 
  protect, 
  admin, 
  user, 
  authorize 
};