'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';

import { IconButton } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

class CommonIconButton extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props
    if (nextProps.disabled === props.disabled) {
      return false;
    }
    return true;
  }

  render() {

    var props = this.props
    return (
      <IconButton style={props.style} iconStyle={props.iconStyle} primary={props.primary} 
        tooltip={props.tooltip} tooltipPosition={props.tooltipPosition} touch={props.touch}
        onTouchTap={this.props.onTouchTap} disabled={this.props.disabled}>
        {
          this.props.children
        }
      </IconButton>
    )
  }
}

export default CommonIconButton;