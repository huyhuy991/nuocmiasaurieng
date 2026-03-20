require("../utils/MongooseUtil");
const Models = require("./Models");

const OrderDAO = {
  // --- Hàm chốt đơn (bạn đã làm ở bước trước) ---
  async insert(order) {
    const mongoose = require("mongoose");
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);
    return result;
  }, // <--- NHỚ THÊM DẤU PHẨY NÀY NẾU CHƯA CÓ NHÉ

  // --- THÊM HÀM MỚI NÀY VÀO DƯỚI CÙNG ---
  async selectByCustID(_cid) {
    const query = { "customer._id": _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },
  async selectByCustID(_cid) {
    const query = { "customer._id": _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  }, // <--- BẠN NHỚ THÊM DẤU PHẨY Ở ĐÂY NHÉ

  // --- THÊM HÀM NÀY VÀO DƯỚI CÙNG ---
  async selectAll() {
    const query = {}; // Lấy tất cả, không lọc gì cả
    const mysort = { cdate: -1 }; // descending (sắp xếp giảm dần theo ngày tạo)
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },
  // --- THÊM HÀM UPDATE MỚI NÀY VÀO DƯỚI CÙNG ---
  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    // Lệnh tìm đúng ID đơn hàng và cập nhật trạng thái mới
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, {
      new: true,
    });
    return result;
  },
};

module.exports = OrderDAO;