require("../utils/MongooseUtil");
const Models = require("./Models");

const ProductDAO = {
  // Hàm lấy tất cả danh sách sản phẩm
  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },
  //hàm insert
  async insert(product) {
    const mongoose = require("mongoose");
    product._id = new mongoose.Types.ObjectId(); // Tự tạo ID mới cho sản phẩm
    const result = await Models.Product.create(product);
    return result;
  },
  // Hàm tìm theo ID
  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },
  // Hàm CẬP NHẬT sản phẩm
  async update(product) {
    const newvalues = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };
    const result = await Models.Product.findByIdAndUpdate(
      product._id,
      newvalues,
      { new: true },
    );
    return result;
  },
  async delete(_id) {
    const result = await Models.Product.findByIdAndDelete(_id);
    return result;
  },

  // 1. Tìm sản phẩm theo ID
  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },

  // 2. Lấy Top sản phẩm MỚI NHẤT
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // -1 là descending (giảm dần)
    const products = await Models.Product.find(query)
      .sort(mysort)
      .limit(top)
      .exec();
    return products;
  },

  // 3. Lấy Top sản phẩm HOT (Bán chạy nhất)
  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: "APPROVED" } }, // Chỉ lấy các đơn đã duyệt
      { $unwind: "$items" }, // Tách các món hàng trong đơn ra
      {
        $group: { _id: "$items.product._id", sum: { $sum: "$items.quantity" } },
      }, // Cộng dồn số lượng theo ID sản phẩm
      { $sort: { sum: -1 } }, // Xếp giảm dần theo tổng số lượng
      { $limit: top }, // Lấy ra số lượng (top) cần thiết
    ]).exec();

    var products = [];
    for (const item of items) {
      const product = await ProductDAO.selectByID(item._id); // Lấy chi tiết sản phẩm
      if (product) products.push(product);
    }
    return products;
  },
  async selectByCatID(_cid) {
    const query = { "category._id": _cid };
    const products = await Models.Product.find(query).exec();
    return products;
  },
  // THÊM HÀM NÀY VÀO: Tìm sản phẩm theo từ khóa (keyword)
  async selectByKeyword(keyword) {
    // Sử dụng RegExp với tùy chọn "i" để tìm kiếm không phân biệt hoa thường
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const products = await Models.Product.find(query).exec();
    return products;
  },
};
module.exports = ProductDAO;