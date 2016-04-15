'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';

import { TextField } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

class CommonTextField extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.forceUpdate) {
      return true
    }
    let props = this.props
    if (nextProps.defaultValue === props.defaultValue &&
        nextProps.value === props.value &&
        nextProps.disabled === props.disabled) {
      return true;
    }
    return true;
  }

  onChange(e) {
    if (this.props.onChange) this.props.onChange(this.refs['commonTextField'].getValue());
  }

  render() {
    var props = this.props
    if (props.value !== undefined) {
      return (
        <TextField floatingLabelText={props.floatingLabelText} hintText={props.hintText}
                   ref='commonTextField' onChange={this.onChange.bind(this)} defaultValue={props.defaultValue}
                   style={props.style} value={props.value} disabled={props.disabled} fullWidth={props.fullWidth}/>
      )
    } else {
      return (
        <TextField floatingLabelText={props.floatingLabelText} 
                   ref='commonTextField' onChange={this.onChange.bind(this)} defaultValue={props.defaultValue}
                   style={props.style} disabled={props.disabled} fullWidth={props.fullWidth}/>
      )
    }
  }
}

export default CommonTextField;