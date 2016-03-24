'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';


import { Paper, FontIcon, RaisedButton, SelectField, TextField, MenuItem, Tabs, Tab,
         Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter,
         Checkbox } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'
import LocationSelectField from '../common/location_select_field'
import CommonTextField from '../common/common_text_field'

class MansionsBase extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  valueChange(key) {
    return function (e, idx, value) {
      let mansion = this.props.mansion
      if (this.refs[key].getValue)
        value = this.refs[key].getValue()
      mansion[key] = value
      this.props.updateParentState({mansion})
    }
  }
  commonTextFiledChange(key) {
    return function (value) {
      let mansion = this.props.mansion
      mansion[key] = value
      this.props.updateParentState({mansion})
    }
  }
  locationSelectFieldChange(level) {
    return function(value) {
      let mansion = this.props.mansion
      mansion[level] = value
      this.props.updateParentState({mansion})
    }
  }
  // getProvinces() {
  //   var provinces = []
  //   for (var province of provinceAndCityAndArea) {
  //     provinces.push(<MenuItem value={province.name} primaryText={province.name} key={province.name}/>)
  //   }
  //   return provinces;
  // }
  // getCity() {
  //   var cityArray = getCityByProvince(this.props.mansion.province)
  //   var retCity = []
  //   for (var city of cityArray) {
  //     retCity.push(<MenuItem value={city.name} primaryText={city.name} key={city.name}/>)
  //   }
  //   return retCity;
  // }
  // getArea() {
  //   var areaArray = getAreaByProvinceAndCity(this.props.mansion.province, this.props.mansion.city)
  //   var retArea = []
  //   for (var area of areaArray) {
  //     retArea.push(<MenuItem value={area} primaryText={area} key={area}/>)
  //   }
  //   return retArea;
  // }
  counter(array) {
    var retValue = 0;
    for (i in array) {
      retValue += array[i]
    }
    return retValue
  }
  /*
          <SelectField value={mansion.province} floatingLabelText='省份' ref='province' style={styles.marginRight}  onChange={this.valueChange('province').bind(this)}>
          { this.getProvinces() }
        </SelectField>
        <SelectField value={mansion.city} floatingLabelText='地市' ref='city' style={styles.marginRight} onChange={this.valueChange('city').bind(this)}>
          { this.getCity() }
        </SelectField>
        <SelectField value={mansion.area} floatingLabelText='区' ref='area' style={styles.marginRight} onChange={this.valueChange('area').bind(this)}>
          { this.getArea() }
        </SelectField>
*/
  render() {
    let styles = this.getStyles()
    let mansion = this.props.mansion;
    return (
      <div style={styles.tab}>
        <CommonTextField hintText="单位名称" floatingLabelText="单位名称" style={styles.marginRight} value={mansion.name} onChange={this.commonTextFiledChange('name').bind(this)}/>
        <CommonTextField hintText="发票抬头" floatingLabelText="发票抬头" ref='invoiceTitle' style={styles.marginRight} value={mansion.invoiceTitle} onChange={this.commonTextFiledChange('invoiceTitle').bind(this)}/>
        <br />
        <LocationSelectField value={mansion.province} floatingLabelText='省份' 
          style={styles.marginRight} level='province' onChange={this.locationSelectFieldChange('province').bind(this)} />
        <LocationSelectField value={mansion.city} floatingLabelText='地市' province={mansion.province}
          style={styles.marginRight} level='city' onChange={this.locationSelectFieldChange('city').bind(this)} />
        <LocationSelectField value={mansion.area} floatingLabelText='区' province={mansion.province} city={mansion.city}
          style={styles.marginRight} level='area' onChange={this.locationSelectFieldChange('area').bind(this)} />
        <br />
        <CommonTextField hintText="详细地址" floatingLabelText="详细地址" ref='address' style={styles.marginRight} value={mansion.address} onChange={this.commonTextFiledChange('address').bind(this)} fullWidth={true}/>
        <br />
        <CommonTextField hintText="楼层总数" floatingLabelText="楼层总数" ref='floorCount' style={styles.marginRight} value={mansion.floorCount} disabled={true}/>
        <CommonTextField hintText="出租房总数" floatingLabelText="出租房总数" ref='housesAvailableCount' style={styles.marginRight} value={this.counter(mansion.housesAvailableCount)} disabled={true}/>
        <CommonTextField hintText="商铺总数" floatingLabelText="商铺总数" ref='shopsAvailableCount' style={styles.marginRight} value={this.counter(mansion.shopsAvailableCount)} disabled={true}/>
        <br />
        <CommonTextField hintText="楼层显示前缀" floatingLabelText="楼层显示前缀" ref='floorDesPrefix' style={styles.marginRight} value={mansion.floorDesPrefix || ' '} disabled={true}/>
        <CommonTextField hintText="楼层显示长度" floatingLabelText="楼层显示长度" ref='housesAvailableCount' style={styles.marginRight} value={mansion.floorDesLength} disabled={true}/>
        <br />
        <CommonTextField hintText="出租房显示长度" floatingLabelText="出租房显示长度" ref='housesDesLength' style={styles.marginRight} value={mansion.housesDesLength} disabled={true}/>
        <CommonTextField hintText="商铺显示长度" floatingLabelText="商铺显示长度" ref='shopsDesLength' style={styles.marginRight} value={mansion.shopsDesLength} disabled={true}/>
      </div>
    )
  }

  getStyles() {
    // const palette = this.props.theme.baseTheme.palette
    // const backgroundColor = palette.primary1Color;
    // const buttom1Color = palette.primary1Color;
    // const buttom2Color = Colors.pinkA200;
    // const borderColor = palette.borderColor;
    // const textColor = palette.textColor;
    // const disabledColor = palette.disabledColor;
    const styles = {
      tab: {
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '30px 20px 40px 20px',
        backgroundColor: Colors.grey100,
        marginBottom: '40px'
      },
      marginRight: {
        marginRight: '20px',
      },
      divider: {
        width: '20px',
        display: 'inline-block',
      }
    }
    return styles;
  }
}
export default MansionsBase;

