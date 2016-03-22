'use strict';
import log from '../../utils/log'
import _ from 'lodash'


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';

import { Paper, FontIcon, RaisedButton, AutoComplete } from 'material-ui/lib'

import * as HouseLayoutPatternsAction from '../../actions/mansion/house_layout_patterns'
import * as ToastActions from '../../actions/master/toast';


class Mansions extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  componentWillMount() {
    
    if (!this.props.houseLayoutPatterns || this.props.houseLayoutPatterns.length === 0) {
      //取得公共布局
      this.props.actions.requestHouseLayoutPatternsClick();
    }
  }

  render() {
    let dataSource2 = ['1','11','22','33']
    return (
      <div>
        <AutoComplete
          floatingLabelText="showAllItems"
          hintText='showAllItems'
          filter={AutoComplete.fuzzyFilter}
          openOnFocus={true}
          dataSource={dataSource2}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    theme: state.mui.theme,
    houseLayoutPatterns: state.houseLayoutPatterns
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.assign({}, ToastActions, HouseLayoutPatternsAction), dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mansions);