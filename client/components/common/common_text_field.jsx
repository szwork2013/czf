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
    if (nextProps.value === props.value &&
        nextProps.disabled === props.disabled) {
      return false;
    }
    return true;
  }

  onChange(e) {
    if (this.props.onChange) this.props.onChange(this.refs['commonTestField'].getValue());
  }

  render() {
    var props = this.props
    return (
      <TextField hintText={props.hintText} floatingLabelText={props.floatingLabelText} 
                 ref='commonTestField' onChange={this.onChange.bind(this)}
                 style={props.style} value={props.value} disabled={props.disabled} fullWidth={props.fullWidth}/>
    )
  }
}

export default CommonTextField;