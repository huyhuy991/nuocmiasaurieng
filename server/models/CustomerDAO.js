require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
  // Lấy thông tin khách hàng qua username hoặc email (dùng cho Đăng ký)
  async selectByUsernameOrEmail(username, email) {
  // Nếu cả 2 đều trống thì coi như không tìm thấy (tránh lỗi so sánh null)
  if (!username && !email) return null; 

  // Chỉ truy vấn những trường có giá trị
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
  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };
    const result = await Models.Customer.findOneAndUpdate(query, newvalues, { new: true });
    return result;
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