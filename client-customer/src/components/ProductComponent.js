import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withRouter from "../utils/withRouter";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }

  render() {
    const prods = this.state.products.map((item) => {
      return (
        <div key={item._id} className="inline">
          <figure>
  {/* Đảm bảo có dấu gạch chéo trước chữ product và truyền đúng item._id */}
  <Link to={'/product/' + item._id}> 
    <img
      src={"data:image/jpg;base64," + item.image}
      width="300px"
      height="300px"
      alt=""
    />
  </Link>
  <figcaption className="text-center">
    {item.name}<br />
    Price: {item.price}
  </figcaption>
</figure>
        </div>
      );
    });

    return (
      <div className="text-center">
        <h2 className="text-center">LIST PRODUCTS</h2>
        {prods}
      </div>
    );
  }

  // Chạy lần đầu tiên khi component được mở lên
  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword); // THÊM CHỖ NÀY: Nếu có từ khóa thì gọi API tìm kiếm
    }
  }

  // Chạy khi người dùng đang ở trang sản phẩm nhưng bấm sang danh mục khác
  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword); // THÊM CHỖ NÀY
    }
  }

  // --- apis ---
  apiGetProductsByCatID(cid) {
    // Đã thêm http://localhost:3000
    axios
      .get("http://localhost:3000/api/customer/products/category/" + cid)
      .then((res) => {
        const result = res.data;
        this.setState({ products: result });
      });
  }
  apiGetProductsByKeyword(keyword) {
    axios
      .get("http://localhost:3000/api/customer/products/search/" + keyword)
      .then((res) => {
        const result = res.data;
        this.setState({ products: result });
      });
  }
}

// Bọc Component bằng withRouter trước khi export
export default withRouter(Product);