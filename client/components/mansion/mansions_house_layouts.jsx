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


import CommonTextField from '../common/common_text_field'
import CommonSelectField from '../common/common_select_field'


class MansionsBaseTab extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
    this.bedroom = []
    this.livingroom = []
    this.brightness = []
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillMount() {
    this.stateHouseLayoutPatterns(this.props.houseLayoutPatterns)
  }

  componentWillReceiveProps(nextProps) {
    this.stateHouseLayoutPatterns(nextProps.houseLayoutPatterns)
  }

  stateHouseLayoutPatterns(houseLayoutPatterns) {
    var houseLayoutPattern = {}
    for (var i in houseLayoutPatterns) {
      houseLayoutPattern = houseLayoutPatterns[i]
      this[houseLayoutPattern.code] = houseLayoutPattern
    }
  }

  commonValueChange(idx, key, isNumber) {
    return function (value) {
      if (isNumber) {
        value = Number(value)
        if (isNaN(value)) 
          value = 0
      } 
      let houseLayouts = this.props.houseLayouts
      houseLayouts[idx][key] = value
      this.props.updateParentState({houseLayouts})
    }
  }

  render() {
    let styles = this.getStyles()
    let houseLayouts = this.props.houseLayouts || []
    return (
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
                <CommonTextField value={houseLayout.description} onChange={this.commonValueChange(idx, 'description').bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn>
                <CommonSelectField value={houseLayout.bedroom} onChange={this.commonValueChange(idx, 'bedroom').bind(this)}
                  floatingLabelText='房间数' items={this.bedroom.items} itemValue='code' itemPrimaryText='description' style={styles.tableCellSelect}/>
                <CommonSelectField value={houseLayout.livingroom} onChange={this.commonValueChange(idx, 'livingroom').bind(this)}
                  floatingLabelText='客厅数' items={this.livingroom.items} itemValue='code' itemPrimaryText='description' style={styles.tableCellSelect}/>
                <CommonSelectField value={houseLayout.brightness} onChange={this.commonValueChange(idx, 'brightness').bind(this)}
                  floatingLabelText='光线' items={this.brightness.items} itemValue='code' itemPrimaryText='description' style={styles.tableCellSelect}/>
                <br />
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <CommonTextField value={houseLayout.defaultDeposit} onChange={this.commonValueChange(idx, 'defaultDeposit', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <CommonTextField value={houseLayout.defaultRental} onChange={this.commonValueChange(idx, 'defaultRental', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <CommonTextField value={houseLayout.defaultSubscription} onChange={this.commonValueChange(idx, 'defaultSubscription', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <CommonTextField value={houseLayout.servicesCharges} onChange={this.commonValueChange(idx, 'servicesCharges', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <CommonTextField value={houseLayout.overdueFine} onChange={this.commonValueChange(idx, 'overdueFine', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        
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
export default MansionsBaseTab;

