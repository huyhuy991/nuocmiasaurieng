const express = require("express");
const router = express.Router();
// daos
const CategoryDAO = require("../models/CategoryDAO");
const ProductDAO = require("../models/ProductDAO");

// 1. Lấy danh sách danh mục (cho Menu)
router.get("/categories", async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

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
// API lấy sản phẩm theo ID Danh mục
router.get("/products/category/:cid", async function (req, res) {
  const _cid = req.params.cid; // Lấy mã danh mục (cid) từ đường dẫn URL
  const products = await ProductDAO.selectByCatID(_cid); // Gọi hàm lọc trong Database
  res.json(products); // Trả kết quả về cho Client
});
// API tìm kiếm sản phẩm theo từ khóa
router.get("/products/search/:keyword", async function (req, res) {
  const keyword = req.params.keyword; // Lấy từ khóa từ đường dẫn URL
  const products = await ProductDAO.selectByKeyword(keyword); // Gọi hàm tìm kiếm trong DAO
  res.json(products); // Trả kết quả về cho Client
});
// API lấy chi tiết một sản phẩm theo ID
router.get("/products/:id", async function (req, res) {
  const _id = req.params.id; // Lấy ID sản phẩm từ đường dẫn URL
  const product = await ProductDAO.selectByID(_id); // Gọi hàm tìm theo ID trong DAO
  res.json(product); // Trả kết quả chi tiết sản phẩm về cho Client
});
module.exports = router;