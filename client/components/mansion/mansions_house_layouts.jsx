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


class MansionsBaseTab extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  valueChange(idx, key, isNumber) {
    return function (e, line, value) {
      let houseLayouts = this.props.houseLayouts
      let relKey = 'houseLayout:'+idx+':'+key
      if (this.refs && this.refs[relKey] && this.refs[relKey].getValue)
        value = this.refs[relKey].getValue()
      if (isNumber) {
        value = Number(value)
        if (isNaN(value)) 
          value = 0
      }  
      houseLayouts[idx][key] = value
      this.props.updateParentState({houseLayouts})
    }
  }
  getPatterns(code) {
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
  getLayoutPatterns(styles, idx, houseLayout, code, description) {
    return (
      <SelectField value={houseLayout[code]} floatingLabelText={description} ref={'houseLayout:'+idx+':'+code} style={styles.tableCellSelect} onChange={this.valueChange(idx, code).bind(this)}>
        { this.getPatterns.bind(this)(code) }
      </SelectField>
    )
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
                <TextField ref={'houseLayout:'+idx+':description'} value={houseLayout.description} onChange={this.valueChange(idx, 'description').bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn>
                { this.getLayoutPatterns.bind(this)(styles, idx, houseLayout, 'bedroom', '房间数') }
                { this.getLayoutPatterns.bind(this)(styles, idx, houseLayout, 'livingroom', '客厅数') }
                { this.getLayoutPatterns.bind(this)(styles, idx, houseLayout, 'brightness', '光线') }
                <br />
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <TextField ref={'houseLayout:'+idx+':defaultDeposit'} value={houseLayout.defaultDeposit} onChange={this.valueChange(idx, 'defaultDeposit', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <TextField ref={'houseLayout:'+idx+':defaultRental'} value={houseLayout.defaultRental} onChange={this.valueChange(idx, 'defaultRental', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <TextField ref={'houseLayout:'+idx+':defaultSubscription'} value={houseLayout.defaultSubscription} onChange={this.valueChange(idx, 'defaultSubscription', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <TextField ref={'houseLayout:'+idx+':servicesCharges'} value={houseLayout.servicesCharges} onChange={this.valueChange(idx, 'servicesCharges', true).bind(this)} style={styles.tableCellTextField}/>
              </TableRowColumn>
              <TableRowColumn style={{width: '8%', paddingLeft: '5px', paddingRight: '5px', overflow: 'auto'}}>
                <TextField ref={'houseLayout:'+idx+':overdueFine'} value={houseLayout.overdueFine} onChange={this.valueChange(idx, 'overdueFine', true).bind(this)} style={styles.tableCellTextField}/>
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

