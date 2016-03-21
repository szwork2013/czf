'use strict';
import log from '../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import * as UserActions from '../actions/user'
import * as ToastActions from '../actions/master/toast';

import NavBar from './nav_bar'
import SideBar from './side_bar'
import Breadcrumbs from './breadcrumbs'


class Desktop extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  render() {
    const { children } = this.props;
    const styles = this.getStyles();
    return (
      <div>
        <NavBar navBarStyle={styles.navBarStyle}/>
        <SideBar sideBarStyle={styles.sideBarStyle}/>
        <div style={styles.containerFluid}>
          <div style={styles.breadcrumbs}>
            <Breadcrumbs />
          </div>
          { children }
          <div style={styles.footer}>
            Healgoo
          </div>
        </div>
      </div>
    )
  }

  getStyles() {
    const styles = {
      navBarStyle: {
        position: 'fixed',
      },
      sideBarStyle: {
        backgroundColor: '#f2f2f2',
        borderRight: '1px solid #ccc',        
        top: '64px',
        width: '256px',
        boxShadow: 'none',
        zIndex: '-1',
        height: 'calc(100% - 64px)'
      },
      containerFluid: {
        position: 'fixed',
        left: '256px',
        top: '64px',
        bottom: '0px',
        transition: 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
      },
      breadcrumbs: {
        position: 'relative',
        zIndex: 13,
        borderBottom: '1px solid #e5e5e5',
        backgroundColor: '#f5f5f5',
        minHeight: '40px',
        lineHeight: '39px',
        padding: '0 12px 0 0',
        display: 'block',
        width: '100%'
      },
      footer: {
        textAlign: 'center',
      }
    }
    if (this.props.sideBar.isShow) {
      styles.containerFluid.transform = 'translate3d(0px, 0, 0)'
      styles.containerFluid.width = 'calc(100% - 256px)'
      styles.containerFluid.animation = 'sideBarToShow 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    } else {
      styles.containerFluid.transform = 'translate3d(-256px, 0, 0)'
      styles.containerFluid.width = '100%'
      styles.containerFluid.animation = 'sideBarToHide 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    }
    return styles;
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    deviceSize: state.mui.deviceSize,
    isLoading: state.loading,
    sideBar: state.sideBar,
    user: state.user.user,
    token: state.user.token
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions, UserActions), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Desktop);