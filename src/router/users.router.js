const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyToken
} = require('../controllers/users.controller');
const { protect } = require('../middlewares/auth.middleware'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser); 
router.post('/verify', protect, verifyToken);
module.exports = router;