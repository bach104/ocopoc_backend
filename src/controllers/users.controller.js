const User = require('../models/users.model');
const { colorize } = require('../utils/colors');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const errors = [];

    if (!username || !email || !password) {
      errors.push('Vui lòng nhập đầy đủ thông tin');
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

    if (password && !passwordRegex.test(password)) {
      errors.push(
        'password yêu cầu ít nhất là 6 kí tự yêu cầu in hoa in thường chữ số và kí tự đặc biệt'
      );
    }

    if (username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        errors.push('username đã tồn tại');
      }
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        errors.push('email đã được sử dụng');
      }
    }

    if (errors.length > 0) {
      errors.forEach(err =>
        console.log(colorize.error(err))
      );

      return res.status(400).json({
        success: false,
        errors
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      role: 'user' 
    });

    const token = generateToken(user._id);

    console.log(
      colorize.success(
        `đăng kí thành công\nid: ${user._id}\nname: ${username}\nemail: ${email}\nrole: ${user.role}\ntoken: ${token}`
      )
    );

    return res.status(201).json({
      success: true,
      message: 'đăng kí thành công',
      data: {
        id: user._id.toString(), 
        username: username,
        email,
        role: user.role,
        token
      }
    });

  } catch (error) {
    console.log(colorize.error(`lỗi server: ${error.message}`));
    return res.status(500).json({
      success: false,
      message: 'lỗi server'
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { account, password } = req.body;
    const errors = [];

    if (!account || !password) {
      errors.push('Vui lòng nhập đầy đủ thông tin');
    }

    if (errors.length > 0) {
      errors.forEach(err => console.log(colorize.warning(err)));

      return res.status(400).json({
        success: false,
        errors
      });
    }
    const user = await User.findOne({
      $or: [
        { email: account },
        { username: account }
      ]
    }).select('+password');

    if (!user) {
      console.log(colorize.error('Sai username hoặc email'));

      return res.status(401).json({
        success: false,
        errors: ['Sai username hoặc email']
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(colorize.error('Sai mật khẩu'));

      return res.status(401).json({
        success: false,
        errors: ['Sai mật khẩu']
      });
    }
    const token = generateToken(user._id);
    console.log(
      colorize.success(
        `Đăng nhập thành công\nid: ${user._id}\naccount: ${account}\nuser: ${user.username}\nrole: ${user.role}\ntoken: ${token}`
      )
    );
    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        token
      }
    });

  } catch (error) {
    console.log(colorize.error(error.message));
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      console.log(colorize.info(`Token logged out: ${token.substring(0, 15)}...`));
      
      if (req.user) {
        console.log(colorize.success(`User ${req.user.username} logged out`));
      }
    }
    
    console.log(colorize.success('✅ Đăng xuất thành công'));

    return res.json({
      success: true,
      message: 'Đăng xuất thành công',
      instruction: 'Vui lòng xóa token ở phía client'
    });
    
  } catch (error) {
    console.log(colorize.error(`Lỗi logout: ${error.message}`));
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};
const verifyToken = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      console.log(colorize.error('Không tìm thấy user trong request'));
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
    console.log(colorize.success(`✅ Token hợp lệ cho user: ${user.username} (${user.role})`));
    return res.json({
      success: true,
      message: 'Token hợp lệ',
      data: {
        id: user._id.toString(), 
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.log(colorize.error(`Lỗi verify token: ${error.message}`));
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xác thực token'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyToken 
};