import axios from "axios";
import React, { Component } from "react";
import withRouter from "../utils/withRouter";

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
    };
  }

  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <div className="align-center">
          <h2 className="text-center">PRODUCT DETAILS</h2>
          <figure className="caption-right">
            <img
              src={"data:image/jpg;base64," + prod.image}
              width="400px"
              height="400px"
              alt=""
            />
            <figcaption>
              <form>
                <table>
                  <tbody>
                    <tr>
                      <td align="right">ID:</td>
                      <td>{prod._id}</td>
                    </tr>
                    <tr>
                      <td align="right">Name:</td>
                      <td>{prod.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Price:</td>
                      <td>{prod.price}</td>
                    </tr>
                    <tr>
                      <td align="right">Category:</td>
                      <td>{prod.category.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Quantity:</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          defaultValue={1}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td>
                        <input type="submit" value="ADD TO CART" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </figcaption>
          </figure>
        </div>
      );
    }
    return <div />;
  }

componentDidMount() {
  // ID sản phẩm được truyền từ withRouter vào props.params
  const id = this.props.params.id; 
  if (id) {
    this.apiGetProduct(id);
  }
}

apiGetProduct(id) {
  // Phải gọi đúng port của Backend (ví dụ 4000)
  axios.get('http://localhost:3000/api/customer/products/' + id).then((res) => {
    this.setState({ product: res.data });
  });
}
}
export default withRouter(ProductDetail);