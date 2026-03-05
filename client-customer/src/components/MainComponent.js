import React, { Component } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./MenuComponent";
import Inform from "./InformComponent";
import Home from "./HomeComponent";
import Product from "./ProductComponent";
// BẮT BUỘC: Bạn phải thêm dòng import này
import ProductDetail from "./ProductDetailComponent"; 

class Main extends Component {
  render() {
    return (
      <div className="body-customer">
        <Menu />
        <Inform />

        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/category/:cid" element={<Product />} />
          {/* Route chi tiết phải khớp với tham số :id bạn lấy trong ProductDetail */}
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/product/search/:keyword" element={<Product />} />
        </Routes>
      </div>
    );
  }
}
export default Main;