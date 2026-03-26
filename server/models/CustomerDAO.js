require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
  // Lấy danh sách TOÀN BỘ khách hàng (dùng cho Admin quản lý)
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },

  // --- CODE MỚI THÊM THEO ẢNH ---
  async selectByID(_id) {
    const customer = await Models.Customer.findById(_id).exec();
    return customer;
  },

  // Lấy thông tin khách hàng qua username hoặc email (dùng cho Đăng ký)
  async selectByUsernameOrEmail(username, email) {
    if (!username && !email) return null; 
    const query = { 
      $or: [
        { username: username ? username : "____DUMMY_VALUE____" }, 
        { email: email ? email : "____DUMMY_VALUE____" }
      ] 
    };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  // Thêm mới một khách hàng vào Database
  async insert(customer) {
    const mongoose = require('mongoose');
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },

  // Kích hoạt tài khoản thông qua ID và Token
  // File: server/models/CustomerDAO.js
async active(_id, token, active) {
  try {
    const newvalues = { active: active };
    // Sử dụng findByIdAndUpdate cho an toàn nhất
    const result = await Models.Customer.findByIdAndUpdate(_id, newvalues, { new: true });
    return result;
  } catch (err) {
    console.log("LỖI BACKEND:", err.message); // Huy nhìn vào Terminal sẽ thấy lỗi này
    return null;
  }
},

  // Lấy khách hàng theo Username và Password (dùng cho Đăng nhập)
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  // Cập nhật thông tin khách hàng
  async update(customer) {
    const newvalues = { 
      username: customer.username, 
      password: customer.password, 
      name: customer.name, 
      phone: customer.phone, 
      email: customer.email 
    };
    const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
    return result;
  }
};

module.exports = CustomerDAO;