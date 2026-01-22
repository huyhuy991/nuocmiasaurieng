const express = require('express');
const router = express.Router();
const AdminDAO = require('../models/AdminDAO');
const JwtUtil = require('../utils/JwtUtil');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập username và password'
      });
    }

    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);

    if (admin) {
      const token = JwtUtil.genToken(username, password);
      return res.json({
        success: true,
        message: 'Đăng nhập thành công',
        token: token
      });
    } else {
      return res.json({
        success: false,
        message: 'Sai tên đăng nhập hoặc mật khẩu'
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router;