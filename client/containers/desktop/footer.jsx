'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import * as UserActions from '../../actions/user'
import * as ToastActions from '../../actions/master/toast';

import { COMPANY_NAME, ICP_NUMBER } from '../../constants/const'



class Footer extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const styles = this.getStyles();
    function homeIcon(styles) {
      return (
        <FontIcon className="material-icons" style={styles.homeIcon}>home</FontIcon>
      );
    }
    return (
      <div style={this.props.footerStyle}>
        <div style={styles.copyright}>
          <div>
            Copyright © 2016 <a href="http://healgoo.com" target="_blank" style={styles.company}>{COMPANY_NAME}</a> - all rights reserved. 
          </div>
          <div>
            <a href="http://www.miitbeian.gov.cn" target="_blank" style={styles.icp}>粤ICP备{ICP_NUMBER}号</a>
          </div>
        </div>
      </div>
    )
  }

  getStyles() {
    const palette = this.props.theme.baseTheme.palette
    // const backgroundColor = palette.primary1Color;
    // const buttom1Color = palette.primary1Color;
    // const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    const textColor = palette.textColor;
    // const disabledColor = palette.disabledColor;
    const styles = {
      copyright: {
        padding: '8px 15px 8px 15px',
        fontWeight: '300px',
        overflow: 'hidden',
        // height: '65px',
        fontSize: '15px',
        lineHeight: '25px',
        color: 'rgba(255, 255, 255, 0.8)'
      },
      company: {
        color: 'rgba(255, 255, 255, 0.8)',
        textDecoration: 'inherit',
      },
      icp: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '12px',
      }
    }
    return styles;
  }

}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    // deviceSize: state.mui.deviceSize,
    // isLoading: state.loading,
    user: state.user.user,
    menus: state.menus
  };
}
export default connect(
  mapStateToProps
)(Footer);