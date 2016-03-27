'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';

import { RaisedButton } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

class CommonRaisedButton extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props
    if (nextProps.label === props.label &&
        nextProps.disabled === props.disabled) {
      return false;
    }
    return true;
  }

  render() {

    var props = this.props
    return (
      <RaisedButton label={props.label} labelPosition={props.labelPosition} style={props.style} primary={props.primary} 
        onTouchTap={this.props.onTouchTap} disabled={this.props.disabled}>
        {
          this.props.children
        }
      </RaisedButton>
    )
  }
}

export default CommonRaisedButton;