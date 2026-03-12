const express = require("express");
const router = express.Router();

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

// daos
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");
const CustomerDAO = require("../models/CustomerDAO");

// --- CATEGORY ---

// 1. Lấy danh sách danh mục (cho Menu)
router.get("/categories", async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// --- PRODUCT ---

// 2. Lấy Top 3 sản phẩm mới
router.get("/products/new", async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

// 3. Lấy Top 3 sản phẩm Hot (bán chạy)
router.get("/products/hot", async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

// 4. API lấy sản phẩm theo ID Danh mục
router.get("/products/category/:cid", async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});

// 5. API tìm kiếm sản phẩm theo từ khóa
router.get("/products/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});

// 6. API lấy chi tiết một sản phẩm theo ID
router.get("/products/:id", async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});

// --- CUSTOMER ---

// API Đăng ký tài khoản
router.post('/signup', async function (req, res) {
  const { username, password, name, phone, email } = req.body;
  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
  if (dbCust) {
    res.json({ success: false, message: 'Exists username or email' });
  } else {
    const now = new Date().getTime();
    const token = CryptoUtil.md5(now.toString());
    const newCust = { username, password, name, phone, email, active: 0, token };
    const result = await CustomerDAO.insert(newCust);
    if (result) {
      const send = await EmailUtil.send(email, result._id, token);
      res.json({ success: !!send, message: send ? 'Please check email' : 'Email failure' });
    } else {
      res.json({ success: false, message: 'Insert failure' });
    }
  }
});

// API Kích hoạt tài khoản
router.post('/active', async function (req, res) {
  const { id, token } = req.body;
  const result = await CustomerDAO.active(id, token, 1);
  res.json(result);
});

// API Đăng nhập
router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
    if (customer) {
      if (customer.active === 1) {
        const token = JwtUtil.genToken();
        res.json({ success: true, message: 'Authentication successful', token, customer });
      } else {
        res.json({ success: false, message: 'Account is deactive' });
      }
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

// API Kiểm tra Token
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token });
});

// API Cập nhật thông tin cá nhân
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const { username, password, name, phone, email } = req.body;
  const customer = { _id, username, password, name, phone, email };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});

module.exports = router;