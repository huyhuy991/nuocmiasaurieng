// CLI: npm install axios --save
import axios from 'axios';
import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Loading...'
    };
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:3000/shoppingonline').then((res) => {
      const result = res.data;
      this.setState({ message: result.message });
    });
  }

  render() {
    return (
      <div>
        <h1>Customer page</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;
