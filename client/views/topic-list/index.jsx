import React, { Component } from 'react';
import {
  inject,
  observer
} from 'mobx-react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Button from '@material-ui/core/Button';
import Container from '../layout/container';
import AppState from '../../store/app-state';

@inject('appState')
@observer
export default class TopicList extends Component {
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
  }

  bootstrap() {
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
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="discription" content="this is description" />
        </Helmet>
        <Button variant="raised" color="secondary">this is a button2</Button>
        <input type="text" onChange={this.changeName} />
        {this.props.appState.msg}
      </Container>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired
}
