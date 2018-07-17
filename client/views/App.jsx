import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Routes from '../config/router';

export default class App extends Component {
  componentDidMount() {

  }

  render() {
    return [
      <div key="banner">
        <Link to="/">首页</Link>
        <Link to="/list">列表页</Link>
        <Link to="/detail">详情页</Link>
      </div>,
      <Routes key="routes" />
    ]
  }
}

// const mobxStore = obserable({
//   count: 0,
//   add: action((num) => {
//     this.count += num;
//   })
// })

// mobxStore.add(1);
