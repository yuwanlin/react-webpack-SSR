import React, { Component } from 'react';
import {
  inject,
  observer
} from 'mobx-react';
import PropTypes from 'prop-types';
import AppState from '../../store/app-state';

@inject('appState')
@observer
export default class TopicList extends Component {
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
  }

  componentDidMount() {

  }

  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        resolve(true);
      }, 1000)
    })
  }

  changeName(e) {
    this.props.appState.name = e.target.value;
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        {this.props.appState.msg}
      </div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired
}
