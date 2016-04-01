'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';


import { Paper, FontIcon, RaisedButton, SelectField, TextField, MenuItem, Tabs, Tab,
         Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter,
         Checkbox, FloatingActionButton } from 'material-ui/lib'

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

  commonTextFiledChange(key, isNumber) {
    return function (value) {
      let mansion = this.props.mansion
      if (isNumber) {
        value = Number(value)
        if (isNaN(value)) 
          value = 0
      } 
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

  counter(array) {
    var retValue = 0;
    for (var i in array) {
      retValue += array[i]
    }
    return retValue
  }
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
        <br />
        <br />
        <br />

        <CommonTextField hintText="出租房单位电价/度" floatingLabelText="出租房单位电价/度" ref='houseElectricChargesPerKWh' style={styles.marginRight} value={mansion.houseElectricChargesPerKWh} onChange={this.commonTextFiledChange('houseElectricChargesPerKWh', true).bind(this)} />
        <CommonTextField hintText="出租房最少用电量/月/度" floatingLabelText="出租房最少用电量/月/度" ref='houseElectricChargesMinimalKWhs' style={styles.marginRight} value={mansion.houseElectricChargesMinimalKWhs} onChange={this.commonTextFiledChange('houseElectricChargesMinimalKWhs', true).bind(this)} />
        <br />
        <CommonTextField hintText="出租房单位水价/吨" floatingLabelText="出租房单位水价/吨" ref='houseWaterChargesPerTon' style={styles.marginRight} value={mansion.houseWaterChargesPerTon} onChange={this.commonTextFiledChange('houseWaterChargesPerTon', true).bind(this)} />
        <CommonTextField hintText="出租房最少用水量/月/吨" floatingLabelText="出租房最少用水量/月/吨" ref='houseWaterChargesMinimalTons' style={styles.marginRight} value={mansion.houseWaterChargesMinimalTons} onChange={this.commonTextFiledChange('houseWaterChargesMinimalTons', true).bind(this)} />
        <br />
        <CommonTextField hintText="门卡出售价/个" floatingLabelText="门卡出售价/个" ref='doorCardSellCharges' style={styles.marginRight} value={mansion.doorCardSellCharges} onChange={this.commonTextFiledChange('doorCardSellCharges', true).bind(this)} />
        <CommonTextField hintText="门卡回收价/个" floatingLabelText="门卡回收价/个" ref='doorCardRecoverCharges' style={styles.marginRight} value={mansion.doorCardRecoverCharges} onChange={this.commonTextFiledChange('doorCardRecoverCharges', true).bind(this)} />
        <br />
        <br />
        <br />
        <br />

        <CommonTextField hintText="楼层总数" floatingLabelText="楼层总数" ref='floorCount' style={styles.marginRight} value={mansion.floorCount} disabled={true}/>
        <CommonTextField hintText="出租房总数" floatingLabelText="出租房总数" ref='housesAvailableCount' style={styles.marginRight} value={this.counter(mansion.housesExistCount)} disabled={true}/>
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
      },
      floatingActionButton: {
        position: 'fixed',
        // bottom: '20px',
        // right: '20px',
      }
    }
    return styles;
  }
}
export default MansionsBase;

