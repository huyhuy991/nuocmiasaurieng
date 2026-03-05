const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

// 1. Cấu hình Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// 2. Kết nối Database
require('./utils/MongooseUtil');

// 3. Khai báo các Route APIs
app.use("/api/customer", require("./api/customer"));
app.use("/api/admin", require("./api/admin"));

// 4. API Test thử
app.get("/shoppingonline", (req, res) => {
  res.json({ message: "Hello from server!" });
});

// 5. Khởi động server
// LƯU Ý: Nếu React chạy cổng 3000, hãy đổi cổng này thành 4000 để tránh trắng trang
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});