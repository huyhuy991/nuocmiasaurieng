const ProductDAO = require("../models/ProductDAO");
const CategoryDAO = require("../models/CategoryDAO");
const express = require("express");
const router = express.Router();
// utils
const JwtUtil = require("../utils/JwtUtil");
// THÊM EMAILUTIL THEO ẢNH
const EmailUtil = require('../utils/EmailUtil');

// daos
const AdminDAO = require("../models/AdminDAO");
const OrderDAO = require("../models/OrderDAO");
// THÊM CUSTOMERDAO THEO ẢNH
const CustomerDAO = require('../models/CustomerDAO');

// login
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(
      username,
      password,
    );
    if (admin) {
      // Tạo token mang thông tin username và password
      const token = JwtUtil.genToken(admin.username, admin.password);
      res.json({
        success: true,
        message: "Authentication successful",
        token: token,
      });
    } else {
      res.json({ success: false, message: "Incorrect username or password" });
    }
  } else {
    res.json({ success: false, message: "Please input username and password" });
  }
});

router.get("/token", JwtUtil.checkToken, function (req, res) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  res.json({ success: true, message: "Token is valid", token: token });
});
// category
router.get("/categories", JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
// Add new category
router.post("/categories", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});
// Update category
router.put("/categories/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});
// Delete category
router.delete("/categories/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});

// product
router.get("/products", JwtUtil.checkToken, async function (req, res) {
  // 1. Lấy toàn bộ danh sách sản phẩm từ DB
  var products = await ProductDAO.selectAll();

  // 2. Xử lý Phân trang (Pagination)
  const sizePage = 4; // Quy định mỗi trang chỉ hiện 4 sản phẩm
  const noPages = Math.ceil(products.length / sizePage); // Tính tổng số trang
  var curPage = 1; // Mặc định là trang 1

  if (req.query.page) curPage = parseInt(req.query.page); // Nếu Client gửi page lên thì lấy page đó

  const offset = (curPage - 1) * sizePage; // Tính vị trí bắt đầu cắt
  products = products.slice(offset, offset + sizePage); // Cắt lấy đúng 4 sản phẩm của trang hiện tại// 3. Trả về kết quả gồm: danh sách đã cắt, tổng số trang, trang hiện tại
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});
// Add new product
router.post("/products", JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // Lấy thời gian hiện tại (tính bằng mili giây)

  // Lấy chi tiết category để nhúng vào sản phẩm
  const category = await CategoryDAO.selectByID(cid);

  const product = {
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category,
  };
  const result = await ProductDAO.insert(product);
  res.json(result);
});
// Update product
router.put("/products/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id; // Lấy ID sản phẩm cần sửa từ body
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category; // Lấy ID danh mục mới
  const image = req.body.image;
  const now = new Date().getTime();
  // 1. Tìm lại thông tin danh mục mới để lưu vào
  const category = await CategoryDAO.selectByID(cid);
  // 2. Tạo đối tượng product mới với đầy đủ thông tin
  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category,
  };
  // 3. Gọi hàm update trong DAO
  const result = await ProductDAO.update(product);
  res.json(result);
});
// Delete product
router.delete("/products/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});

// THÊM ROUTE SENDMAIL THEO ẢNH
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});

// THÊM ROUTE DEACTIVE THEO ẢNH
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});

// --- order ---
router.get("/orders", JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

// THÊM LẤY ĐƠN HÀNG THEO KHÁCH HÀNG
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

// Cập nhật trạng thái đơn hàng (Duyệt / Hủy)
router.put("/orders/status/:id", JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id; // Lấy mã ID của đơn hàng từ URL
  const newStatus = req.body.status; // Lấy trạng thái mới (APPROVED hoặc CANCELED) từ dữ liệu gửi lên

  // Gọi hàm update của OrderDAO để lưu vào Database
  const result = await OrderDAO.updateStatus(_id, newStatus);

  // Trả kết quả về cho React
  res.json(result);
});

module.exports = router;