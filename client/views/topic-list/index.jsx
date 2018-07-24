import React, { Component } from 'react';
import {
  inject,
  observer
} from 'mobx-react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Container from '../layout/container';
import AppState from '../../store/app-state';
import TopicListItem from './list-item';


@inject('appState')
@observer
export default class TopicList extends Component {
  constructor() {
    super();
    this.state = {
      tabIndex: 0
    }
    this.changeTab = this.changeTab.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
  }

  bootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        resolve(true);
      }, 1000)
    })
  }

  changeTab(e, index) {
    this.setState({
      tabIndex: index
    })
  }

  /* eslint-disable */
  listItemClick() {
    alert(1);
  }
  /* eslint-disable */


  render() {
    const { tabIndex } = this.state;
    const topic = {
      title: 'title',
      username: 'username',
      reply_count: 20,
      visit_count: 30,
      create_at: 'abcdefg',
      tab: 'share',
      image: 'http://a.hiphotos.baidu.com/image/h%3D300/sign=4a51c9cd7e8b4710d12ffbccf3ccc3b2/b64543a98226cffceee78e5eb5014a90f703ea09.jpg'
    };
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="discription" content="this is description" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          <Tab label="全部" />
          <Tab label="分享" />
          <Tab label="工作" />
          <Tab label="问答" />
          <Tab label="精品" />
          <Tab label="测试" />
        </Tabs>
        <TopicListItem onClick={this.listItemClick} topic={topic}/>
      </Container>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired
}
