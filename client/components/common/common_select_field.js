'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';

import { SelectField, MenuItem } from 'material-ui/lib'

class CommonSelectField extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props
    if (nextProps.forceUpdate) {
      return true
    }
    if (nextProps.value === props.value &&
        nextProps.disabled === props.disabled) {
        return false;      
    }
    return true;
  }

  getMenuItems(items, key, value, primaryText, excludeKey) {
    var retMenuItems = []
    var item = {}
    if (key) {
      for (let idx in items) {
        if (excludeKey && excludeKey.indexOf(idx)!==-1) {
          continue;
        }
        item = items[idx]
        retMenuItems.push(<MenuItem value={item[value]} primaryText={item[primaryText]} key={item[key]}/>)
      }
    } else {
      let now = (new Date()).getTime().toString()
      for (let idx in items) {
        if (excludeKey && excludeKey.indexOf(idx)!==-1) {
          continue;
        }
        item = items[idx]
        retMenuItems.push(<MenuItem value={item[value]} primaryText={item[primaryText]} key={now+idx}/>)
      }
    }
    return retMenuItems
  }

  onChange(e, idx, value) {
    if (this.props.onChange) this.props.onChange(value, idx);
  }

  render() {
    var props = this.props
    return (
      <SelectField value={props.value} floatingLabelText={props.floatingLabelText} style={props.style}
          onChange={this.onChange.bind(this)} 
          disabled={props.disabled} fullWidth={props.fullWidth}
          >
          { this.getMenuItems(props.items, props.itemKey, props.itemValue, props.itemPrimaryText, props.excludeKey) }
        </SelectField>
    )
  }
}

export default CommonSelectField;