'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';

import { Dialog, RaisedButton } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

class CommonIconButton extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props
    if (nextProps.title === props.title && nextProps.open === props.open) {
      return false;
    }
    return true;
  }

  render() {
    var styles = this.getStyles()
    var props = this.props
    return (
      <Dialog title={this.props.title} modal={true} open={this.props.open}>
        <div style={{width: '100%', textAlign: 'center', marginTop: '30px'}}>
          <RaisedButton label="确定" primary={true} style={styles.marginRight} onTouchTap={this.props.ok}/>
          <RaisedButton label="取消" primary={true} style={styles.marginRight} onTouchTap={this.props.cancel}/>
        </div>
      </Dialog>
    )
  }

  getStyles() {
    const styles = {
      marginRight: {
        marginRight: '20px',
      },
    }
    return styles
  }
}

export default CommonIconButton;