'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';

import { SelectField, MenuItem } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

class LocationSelectField extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props
    if (nextProps.value === props.value &&
        nextProps.province === props.province &&
        nextProps.city === props.city) {
      return false;
    }
    return true;
  }


  getProvinces() {
    var provinces = []
    for (var province of provinceAndCityAndArea) {
      provinces.push(<MenuItem value={province.name} primaryText={province.name} key={province.name}/>)
    }
    return provinces;
  }
  getCity() {
    var cityArray = getCityByProvince(this.props.province)
    var retCity = []
    for (var city of cityArray) {
      retCity.push(<MenuItem value={city.name} primaryText={city.name} key={city.name}/>)
    }
    return retCity;
  }
  getArea() {
    var areaArray = getAreaByProvinceAndCity(this.props.province, this.props.city)
    var retArea = []
    for (var area of areaArray) {
      retArea.push(<MenuItem value={area} primaryText={area} key={area}/>)
    }
    return retArea;
  }

  valueChange(e, idx, value) {
    if (this.props.onChange) this.props.onChange(value);
  }

  getSelectItem(level) {
    switch(level) {
      case 'province':
        return this.getProvinces()
      case 'city':
        return this.getCity()
      case 'area':
        return this.getArea()
    }
  }
  render() {
    var props = this.props
    return (
      <SelectField value={props.value} floatingLabelText={props.floatingLabelText} 
                   style={props.style} onChange={this.valueChange.bind(this)}>
        {
          this.getSelectItem(props.level)
        }          
      </SelectField>  )}
}

export default LocationSelectField;