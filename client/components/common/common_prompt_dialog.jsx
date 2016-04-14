'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import Colors from 'material-ui/lib/styles/colors';

import { Dialog, RaisedButton, TextField } from 'material-ui/lib'

import { provinceAndCityAndArea, getCityByProvince, getAreaByProvinceAndCity } from '../../utils/location'

class CommonPromptDialog extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props
    if (nextProps.title === props.title && nextProps.open === props.open &&
      nextProps.hintText === props.hintText) {
      return false;
    }
    return true;
  }

  ok() {
    var value = this.refs['inputField'].getValue()
    if (this.props.ok) {
      this.props.ok(value)
    }
  }

  cancel() {
    if (this.props.cancel) {
      this.props.cancel()
    }
  }

  render() {
    var styles = this.getStyles()
    var props = this.props
    return (
      <Dialog title={this.props.title} modal={true} open={this.props.open}>
        <TextField hintText={this.props.hintText} floatingLabelText={this.props.hintText} fullWidth={true} ref='inputField'/>
        <div style={{width: '100%', textAlign: 'center', marginTop: '30px'}}>
          <RaisedButton label="确定" primary={true} style={styles.marginRight} onTouchTap={this.ok.bind(this)}/>
          <RaisedButton label="取消" primary={true} style={styles.marginRight} onTouchTap={this.cancel.bind(this)}/>
        </div>
      </Dialog>
    )
  }

  getStyles() {
    const styles = {
      marginRight: {
        marginRight: '20px',
      },
    }
    return styles
  }
}

export default CommonPromptDialog;