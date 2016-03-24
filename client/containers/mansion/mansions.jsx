'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

import Colors from 'material-ui/lib/styles/colors';

import { Paper, FontIcon, RaisedButton, SelectField, TextField, MenuItem, Tabs, Tab,
         Table, TableHeader, TableRow, TableHeaderColumn, TableBody, TableRowColumn, TableFooter,
         Checkbox } from 'material-ui/lib'

import * as HouseLayoutPatternsAction from '../../actions/mansion/house_layout_patterns'
import * as MansionsAction from '../../actions/mansion/mansions'
import * as ToastActions from '../../actions/master/toast';


class Mansions extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      mansion: {}
    }
  }

  /*
   * 组件加载
   */
  componentWillMount() {
    if (!this.props.houseLayoutPatterns || this.props.houseLayoutPatterns.length === 0) {
      //取得公共布局
      this.props.actions.requestHouseLayoutPatternsClick();
    }
    if (!this.props.mansions || this.props.mansions.length === 0) {
      //取得所有资产
      this.props.actions.requestMansionsClick();
    } else {
      //物业单位默认选择第一个
      if (_.isEmpty(this.state.mansion)) {
        for (let idx in this.props.mansions) {
          let mansion = _.cloneDeep(this.props.mansions[idx]);
          this.setState({mansion})
          this.getMansionAllInfo(mansion)
          return
        }
      }
    }
  }

  /*
   * 组件props更新
   */
  componentWillReceiveProps(nextProps) {
    //物业单位默认选择第一个
    if (nextProps.mansions && nextProps.mansions.length>0 && _.isEmpty(this.state.mansion)) {
      for (let idx in nextProps.mansions) {
        let mansion = _.cloneDeep(nextProps.mansions[idx]);
        this.setState({mansion})
        this.getMansionAllInfo(mansion)
        return
      }
    }
  }

  /*
   * 取得物业的出租房、商铺信息
   */
  getMansionAllInfo(mansion) {
    let formData = {}
    if (!mansion.houses) {
      formData.houses = true
    }
    // if (!mansion.houseLayouts) {
    //   formData.houseLayouts = true
    // }
    if (!mansion.shops) {
      formData.shops = true
    }
    if (!_.isEmpty(formData)) {
      formData.mansionId = mansion._id
      this.props.actions.requestMansionInfoClick(formData);
    }
  }

  /*
   * 取得所有物业
   */
  getOwnMansions(mansions) {
    let retMansions = []
    let userId = this.props.user._id
    let mansion = {}
    for (let idx in mansions) {
      mansion = mansions[idx]
      if (mansion.ownerId === userId)
        retMansions.push(<MenuItem value={mansion._id} primaryText={mansion.name} key={mansion._id}/>)
    }
    return retMansions;
  }
  handleMansionsChange(e, idx, value) {
    let mansion = _.cloneDeep(this.props.mansions[value])
    this.setState({mansion});
    this.getMansionAllInfo(mansion)
  }

  /*
   * 基础信息Tab
   */
  getMansionTab(styles) {
    let mansion = this.state.mansion
    function mansionChange(key) {
      return function (e, idx, value) {
        let mansion = this.state.mansion
        if (value)
          mansion[key] = value
        else if (this.refs[key].getValue)
          mansion[key] = this.refs[key].getValue()
        this.setState({mansion})
      }
    }
    function getProvinces() {
      var provinces = []
      for (var province of provinceAndCityAndArea) {
        provinces.push(<MenuItem value={province.name} primaryText={province.name} key={province.name}/>)
      }
      return provinces;
    }
    function getCity() {
      var cityArray = getCityByProvince(this.state.mansion.province)
      var retCity = []
      for (var city of cityArray) {
        retCity.push(<MenuItem value={city.name} primaryText={city.name} key={city.name}/>)
      }
      return retCity;
    }
    function getArea() {
      var areaArray = getAreaByProvinceAndCity(this.state.mansion.province, this.state.mansion.city)
      var retArea = []
      for (var area of areaArray) {
        retArea.push(<MenuItem value={area} primaryText={area} key={area}/>)
      }
      return retArea;
    }
    function counter(array) {
      var retValue = 0;
      for (i in array) {
        retValue += array[i]
      }
      return retValue
    }
    return (
      <Tab label="基础信息" >
        <div style={styles.tab}>
          <TextField hintText="单位名称" floatingLabelText="单位名称" ref='name' style={styles.marginRight} value={mansion.name} onChange={mansionChange('name').bind(this)}/>
          <TextField hintText="发票抬头" floatingLabelText="发票抬头" ref='invoiceTitle' style={styles.marginRight} value={mansion.invoiceTitle} onChange={mansionChange('invoiceTitle').bind(this)}/>
          <br />
          <SelectField value={mansion.province} floatingLabelText='省份' ref='province' style={styles.marginRight}  onChange={mansionChange('province').bind(this)}>
            { getProvinces.bind(this)() }
          </SelectField>
          <SelectField value={mansion.city} floatingLabelText='地市' ref='city' style={styles.marginRight} onChange={mansionChange('city').bind(this)}>
            { getCity.bind(this)() }
          </SelectField>
          <SelectField value={mansion.area} floatingLabelText='区' ref='area' style={styles.marginRight} onChange={mansionChange('area').bind(this)}>
            { getArea.bind(this)() }
          </SelectField>
          <br />
          <TextField hintText="详细地址" floatingLabelText="详细地址" ref='address' style={styles.marginRight} value={mansion.address} onChange={mansionChange('address').bind(this)} fullWidth={true}/>
          <br />
          <TextField hintText="楼层总数" floatingLabelText="楼层总数" ref='floorCount' style={styles.marginRight} value={mansion.floorCount} disabled={true}/>
          <TextField hintText="出租房总数" floatingLabelText="出租房总数" ref='housesAvailableCount' style={styles.marginRight} value={counter(mansion.housesAvailableCount)} disabled={true}/>
          <TextField hintText="商铺总数" floatingLabelText="商铺总数" ref='shopsAvailableCount' style={styles.marginRight} value={counter(mansion.shopsAvailableCount)} disabled={true}/>
          <br />
          <TextField hintText="楼层显示前缀" floatingLabelText="楼层显示前缀" ref='floorDesPrefix' style={styles.marginRight} value={mansion.floorDesPrefix || ' '} disabled={true}/>
          <TextField hintText="楼层显示长度" floatingLabelText="楼层显示长度" ref='housesAvailableCount' style={styles.marginRight} value={mansion.floorDesLength} disabled={true}/>
          <br />
          <TextField hintText="出租房显示长度" floatingLabelText="出租房显示长度" ref='housesDesLength' style={styles.marginRight} value={mansion.housesDesLength} disabled={true}/>
          <TextField hintText="商铺显示长度" floatingLabelText="商铺显示长度" ref='shopsDesLength' style={styles.marginRight} value={mansion.shopsDesLength} disabled={true}/>
        </div>
      </Tab>
    )
  }

  /*
   * 户型Tab
   */
  getHouseLayoutsTab(styles) {
    function houseLayoutChange(idx, key, isNumber) {
      return function (e, line, value) {
        let houseLayouts = this.state.mansion.houseLayouts
        let relKey = 'houseLayout:'+idx+':'+key
        if (this.refs && this.refs[relKey] && this.refs[relKey].getValue)
          value = this.refs[relKey].getValue()
        if (isNumber) {
          value = Number(value)
          log.info(value, value===NaN)
          if (isNaN(value)) 
            value = 0
        }  
        houseLayouts[idx][key] = value
        this.setState({mansion})
      }
    }
    function getPatterns(code) {
      var houseLayoutPatterns = this.props.houseLayoutPatterns;
      var pattern = {items: []}
      for (var i in houseLayoutPatterns) {
        pattern = houseLayoutPatterns[i]
        if (pattern.code === code) break;
      }
      return pattern.items.map( item => (
        <MenuItem value={item.code} primaryText={item.description} key={item.code+item.description}/>
      ))
    }
    function getLayoutPatterns(styles, idx, houseLayout, code, description) {
      return (
        <SelectField value={houseLayout[code]} floatingLabelText={description} ref={'houseLayout:'+idx+':'+code} style={styles.tableCellSelect} onChange={houseLayoutChange(idx, code).bind(this)}>
          { getPatterns.bind(this)(code) }
        </SelectField>
      )
    }
    let mansion = this.state.mansion
    let houseLayouts = mansion.houseLayouts || []
    return (
      <Tab label="户型（出租房）">
        <div style={styles.tab}>
          <Table selectable={false} fixedHeader={true}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={{width: '12%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>户型名</TableHeaderColumn>
                <TableHeaderColumn>属性</TableHeaderColumn>
                <TableHeaderColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>默认押金</TableHeaderColumn>
                <TableHeaderColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>默认租金</TableHeaderColumn>
                <TableHeaderColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>默认定金</TableHeaderColumn>
                <TableHeaderColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>物业费/月</TableHeaderColumn>
                <TableHeaderColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>逾期罚款/天</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} deselectOnClickaway={false} showRowHover={true} stripedRows={true}>
            {houseLayouts.map((houseLayout, idx) => (
              <TableRow key={'houseLayout:'+idx} >
                <TableRowColumn style={{width: '12%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                  <TextField ref={'houseLayout:'+idx+':description'} value={houseLayout.description} onChange={houseLayoutChange(idx, 'description').bind(this)} style={styles.tableCellTextField}/>
                </TableRowColumn>
                <TableRowColumn>
                  { getLayoutPatterns.bind(this)(styles, idx, houseLayout, 'bedroom', '房间数') }
                  { getLayoutPatterns.bind(this)(styles, idx, houseLayout, 'livingroom', '客厅数') }
                  { getLayoutPatterns.bind(this)(styles, idx, houseLayout, 'brightness', '光线') }
                  <br />
                </TableRowColumn>
                <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                  <TextField ref={'houseLayout:'+idx+':defaultDeposit'} value={houseLayout.defaultDeposit} onChange={houseLayoutChange(idx, 'defaultDeposit', true).bind(this)} style={styles.tableCellTextField}/>
                </TableRowColumn>
                <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                  <TextField ref={'houseLayout:'+idx+':defaultRental'} value={houseLayout.defaultRental} onChange={houseLayoutChange(idx, 'defaultRental', true).bind(this)} style={styles.tableCellTextField}/>
                </TableRowColumn>
                <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                  <TextField ref={'houseLayout:'+idx+':defaultSubscription'} value={houseLayout.defaultSubscription} onChange={houseLayoutChange(idx, 'defaultSubscription', true).bind(this)} style={styles.tableCellTextField}/>
                </TableRowColumn>
                <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                  <TextField ref={'houseLayout:'+idx+':servicesCharges'} value={houseLayout.servicesCharges} onChange={houseLayoutChange(idx, 'servicesCharges', true).bind(this)} style={styles.tableCellTextField}/>
                </TableRowColumn>
                <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                  <TextField ref={'houseLayout:'+idx+':overdueFine'} value={houseLayout.overdueFine} onChange={houseLayoutChange(idx, 'overdueFine', true).bind(this)} style={styles.tableCellTextField}/>
                </TableRowColumn>
              </TableRow>
            ))}
            </TableBody>
          </Table>
          
        </div>
      </Tab>
    )
  }

  /*
   * 出租房Tab
   */
  getHousesTab(styles) {
    return (
      <Tab label="出租房">
        
      </Tab>
    )
  }
  getShopsTab(styles) {
    return (
      <Tab label="商铺">
      2
      </Tab>
    )
  }

  render() {
    let styles = this.getStyles()
    let mansion = this.state.mansion;
    return (
      <div>
        <SelectField value={mansion._id} onChange={this.handleMansionsChange.bind(this)} 
          floatingLabelText='物业单位' selectFieldRoot={{}}>
          { this.getOwnMansions(this.props.mansions) }
        </SelectField>
        <span></span>
        <br/>
        <Tabs initialSelectedIndex={0} >
          { this.getMansionTab(styles) }
          { this.getHouseLayoutsTab(styles) }
          { this.getHousesTab(styles, mansion) }
          { this.getShopsTab(styles, mansion) }
        </Tabs>
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
      tableCellTextField: {
        minWidth: '80px',
        width: '100%',
        fontSize: '12px',
      },
      tableCellSelect: {
        minWidth: '80px',
        width: '30%',
        fontSize: '12px',
        marginRight: '10px',
      }
    }
    return styles;
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    location: state.location,
    user: state.user.user,
    houseLayoutPatterns: state.houseLayoutPatterns,
    mansions: state.mansions
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions, HouseLayoutPatternsAction, MansionsAction), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mansions);