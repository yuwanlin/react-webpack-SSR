import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

const styles = {
  root: {
    width: '100%'
  },
  flex: {
    flex: 1
  }
}


class MainAppBar extends Component {
  constructor() {
    super();
    this.onHomeIconClick = this.onHomeIconClick.bind(this);
    this.createButtonClick = this.createButtonClick.bind(this);
    this.loginButtonClick = this.loginButtonClick.bind(this);
  }
  /* eslint-disable */
  onHomeIconClick() {

  }

  createButtonClick() {

  }

  loginButtonClick() {

  }
  /* eslint-disable */

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <ToolBar>
            <IconButton color="secondary" onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              JNode
            </Typography>
            <Button variant="raised" color="secondary" onClick={this.createButtonClick}>
              新建话题
            </Button>
            <Button color="secondary" onClick={this.loginButtonClick}>
              登录
            </Button>
          </ToolBar>
        </AppBar>
      </div>
    )
  }
}

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MainAppBar);
