import axios from "axios";
import React, { Component } from "react";
// THÊM DÒNG NÀY: Import thư viện Link
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
    };
  }

  render() {
    // 1. Cập nhật Link cho Sản phẩm Mới (NEW PRODUCTS)
    const newprods = this.state.newprods.map((item) => {
      return (
        <div key={item._id} className="inline">
          <figure>
            {/* Đường dẫn phải bắt đầu bằng /product/ và cộng với ID sản phẩm */}
            <Link to={'/product/' + item._id}>
                <img src={"data:image/jpg;base64," + item.image} width="300px" height="300px" alt="" />
            </Link>
            <figcaption className="text-center">
                {item.name}<br />
                Price: {item.price}
            </figcaption>
            </figure>
        </div>
      );
    });

    // 2. Cập nhật Link cho Sản phẩm HOT
    const hotprods = this.state.hotprods.map((item) => {
      return (
        <div key={item._id} className="inline">
          <figure>
            {/* SỬA CHỖ NÀY: Thêm đường dẫn /product/ kèm ID sản phẩm */}
            <Link to={"/product/" + item._id}>
              <img
                src={"data:image/jpg;base64," + item.image}
                width="300px"
                height="300px"
                alt=""
              />
            </Link>
            <figcaption className="text-center">
              {item.name}
              <br />
              Price: {item.price}
            </figcaption>
          </figure>
        </div>
      );
    });

    return (
      <div>
        <div className="align-center">
          <h2 className="text-center">NEW PRODUCTS</h2>
          {newprods}
        </div>
        {this.state.hotprods.length > 0 ? (
          <div className="align-center">
            <h2 className="text-center">HOT PRODUCTS</h2>
            {hotprods}
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  // --- apis ---
  apiGetNewProducts() {
    axios.get("http://localhost:3000/api/customer/products/new").then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }

  apiGetHotProducts() {
    axios.get("http://localhost:3000/api/customer/products/hot").then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }
}
export default Home;