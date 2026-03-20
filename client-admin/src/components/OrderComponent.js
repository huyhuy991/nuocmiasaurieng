import axios from "axios";
import React, { Component } from "react";
import MyContext from "../contexts/MyContext";

class Order extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
    };
  }

  render() {
    // 1. Tạo bảng Danh sách đơn hàng
    const orders = this.state.orders.map((item) => {
      return (
        <tr
          key={item._id}
          className="datatable"
          onClick={() => this.trItemClick(item)}
        >
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{item.total}</td>
          <td>{item.status}</td>
          <td>
            {/* Nếu đơn hàng đang PENDING thì hiện 2 nút Duyệt / Hủy */}
            {item.status === "PENDING" ? (
              <div>
                <span
                  className="link"
                  onClick={() => this.lnkApproveClick(item._id)}
                >
                  APPROVE
                </span>{" "}
                ||
                <span
                  className="link"
                  onClick={() => this.lnkCancelClick(item._id)}
                >
                  CANCEL
                </span>
              </div>
            ) : (
              <div />
            )}
          </td>
        </tr>
      );
    });

    // 2. Tạo bảng Chi tiết đơn hàng (Chỉ hiện khi click vào 1 dòng ở trên)
    var items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className="datatable">
            <td>{index + 1}</td>
            <td>{item.product._id}</td>
            <td>{item.product.name}</td>
            <td>
              <img
                src={"data:image/jpg;base64," + item.product.image}
                width="70px"
                height="70px"
                alt=""
              />
            </td>
            <td>{item.product.price}</td>
            <td>{item.quantity}</td>
            <td>{item.product.price * item.quantity}</td>
          </tr>
        );
      });
    }

    // 3. Render giao diện ra màn hình
    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Creation date</th>
                <th>Cust.name</th>
                <th>Cust.phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>{/* Phần ẩn/hiện bảng chi tiết đơn hàng */}
        {this.state.order ? (
          <div className="align-center">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th>
                  <th>Prod.ID</th>
                  <th>Prod.name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }

  // Tự động gọi API lấy đơn hàng khi mở trang
  componentDidMount() {
    this.apiGetOrders();
  }

  // --- event-handlers ---
  // Khi bấm APPROVE
  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, "APPROVED");
  }

  // Khi bấm CANCEL
  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, "CANCELED");
  }

  // --- apis ---
  // API gửi trạng thái mới xuống Server
  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { "x-access-token": this.context.token } };

    // Nhớ thêm http://localhost:3000 để gọi API không bị lỗi nhé
    axios
      .put("http://localhost:3000/api/admin/orders/status/" + id, body, config)
      .then((res) => {
        const result = res.data;
        if (result) {
          this.apiGetOrders(); // Cập nhật lại danh sách sau khi thay đổi thành công
        } else {
          alert("SORRY BABY!");
        }
      });
  }
  // --- event-handlers ---
  trItemClick(item) {
    this.setState({ order: item });
  }

  // --- apis ---
  apiGetOrders() {
    const config = { headers: { "x-access-token": this.context.token } };
    // Mình có thêm tiền tố http://localhost:3000 để đảm bảo gọi API thành công nhé
    axios.get("http://localhost:3000/api/admin/orders", config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}
export default Order;