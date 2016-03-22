'use strict';
import log from '../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import Colors from 'material-ui/lib/styles/colors';
import { Paper, Avatar, FontIcon, RaisedButton, Divider, ClearFix } from 'material-ui/lib'


class NoFound extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  goBack() {
    browserHistory.goBack()
  }

  render() {
    let styles = this.getStyles()
    return (
      <div>
        <div style={styles.background}></div>
        <div style={styles.tableContainer}>
          <div style={styles.cellContainer}>
            <Paper zDepth={3} style={styles.paper}>
              <div style={styles.header}>
                Could Not Find It
              </div>
              <div style={styles.body}>
                <span style={{position: 'relative', right: '-30px', color: Colors.lightGreen500}}>4</span>
                <span style={{position: 'relative'}}>0</span>
                <span style={{position: 'relative', left: '-30px', color: Colors.lightGreen500}}>4</span>
              </div>
              <div style={styles.footer}>
                <RaisedButton primary={true} labelStyle={{color: 'white'}} label={'Back'} onMouseUp={this.goBack.bind(this)}/>
              </div>
            </Paper>
          </div>
        </div>
      </div>
    )
  }

  getStyles() {
    const palette = this.props.theme.baseTheme.palette
    const backgroundColor = palette.primary1Color;
    const buttom1Color = palette.primary1Color;
    const buttom2Color = Colors.pinkA200;
    const borderColor = palette.borderColor;
    const textColor = palette.textColor;
    const disabledColor = palette.disabledColor;
    const styles = {
      background: {
        backgroundColor: backgroundColor,
        height: '100vh',
        position: 'fixed',
        width: '100%',
        zIndex: '-1000'
      },
      tableContainer: {
        display: 'table',
        margin: 'auto',
      },
      cellContainer: {
        display: 'table-cell',
        verticalAlign: 'middle',
      },
      paper: {
        padding: '0px',
        margin: '20% auto 20% auto',
        overflow: 'hidden',
        backgroundColor: Colors.grey200,
        padding: '60px',
        borderRadius: '34px',
      },
      header: {
        textAlign: 'center',
        margin: 'auto',
        fontSize: '32px',
        fontWeight: '900px',
        color: Colors.grey700
      },
      body: {
        textAlign: 'center',
        margin: 'auto',
        fontSize: '240px',
        fontWeight: '900px',
        color: Colors.grey800
      },
      footer: {
        color: 'white',
        textAlign: 'center',
        margin: 'auto',
        fontSize: '20px',
      }
    }
    return styles;
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme
  };
}
export default connect(
  mapStateToProps
)(NoFound);