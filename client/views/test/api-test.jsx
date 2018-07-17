import React, { Component } from 'react';
import axios from 'axios';

/* eslint-disable */
export default class TestApi extends Component {
  getTopics() {
    axios.get('/api/topics')
      .then(resp => {
        console.log(resp);
      }).catch(err => {
        console.log(err);
      })

  }

  login() {
    axios.post('/api/user/login', {
      accessToken: '1c195236-65b4-48c4-8ca1-a6feb3acac68'
    })
      .then(resp => {
        console.log(resp);
      }).catch(err => {
        console.log(err);
      })
  }

  markAll() {
    axios.post('api/message/mark_all?needAccessToken=true')
      .then(resp => {
        console.log(resp);
      }).catch(console.log)
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics}>getTopics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    )
  }
}
/* eslint-enable */
