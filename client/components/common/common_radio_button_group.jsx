'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';

import { RadioButtonGroup } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

class CommonRadioButtonGroup extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props
    // log.error(nextProps.forceUpdate)
    if (nextProps.forceUpdate) {
      return true
    }
    if (nextProps.valueSelected === props.valueSelected) {
      return false;
    }
    return true;
  }

  render() {

    var props = this.props
    return (
      <RadioButtonGroup name={props.name} valueSelected={props.valueSelected} style={props.style}
        onChange={this.props.onChange}>
        {
          this.props.children
        }
      </RadioButtonGroup>
    )
  }
}

export default CommonRadioButtonGroup;


