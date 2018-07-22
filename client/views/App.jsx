import React, { Component } from 'react';
import Routes from '../config/router';

import AppBar from './layout/app-bar';

export default class App extends Component {
  render() {
    return [
      <AppBar key="appbar" />,
      <Routes key="routes" />
    ]
  }
}
