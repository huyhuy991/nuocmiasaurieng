import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Inform extends Component {
  static contextType = MyContext; // sử dụng this.context để truy cập global state

  render() {
    return (
      <div className="border-bottom">
        <div className="float-left">
          {this.context.token === '' ? (
            <div>
              <Link to='/login'>Login</Link> | <Link to='/signup'>Sign-up</Link> | <Link to='/active'>Active</Link>
            </div>
          ) : (
            <div>
              Hello <b>{this.context.customer.name}</b> | 
              <Link to='/home' onClick={() => this.lnkLogoutClick()}>Logout</Link> | 
              <Link to='/myprofile'>My profile</Link> | 
              {/* Cập nhật đường dẫn đến trang đơn hàng của tôi */}
              <Link to='/myorders'>My orders</Link>
            </div>
          )}
        </div>
        <div className="float-right">
          <Link to='/mycart'>My cart</Link> have <b>{this.context.mycart.length}</b> items
        </div>
        <div className="float-clear" />
      </div>
    );
  }

  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    // Xóa sạch giỏ hàng khi khách hàng đăng xuất để đảm bảo tính riêng tư
    this.context.setMycart([]); 
  }
}

export default Inform;