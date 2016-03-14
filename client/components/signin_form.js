'use strict';

import log from '../utils/log'

import config from '../../config'
import React, { Component, PropTypes } from 'react';

export default class SignInForm extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleSubmit(e) {
    e.preventDefault();
    let mobile = this.refs.mobile.value;
    let password = this.refs.password.value;
    let formData = {
      name: mobile,
      password: password,
    };
    this.props.signinSubmit(formData);
  }

  render() {
    return (
      <div className="signin">
        <div className="project-name">
          <span className="company">Welkinm</span>
          <br/>
          <span>{config.name}</span>
        </div>
        <form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
            <input s={12} label="邮箱" validate  ref="mobile" required defaultValue=''>
            </input>
            <input s={12} label="密码" validate  type="password" ref="password" required defaultValue=''>
            </input>
            <button
              label="登录"
              type="submit"
              style={{ marginTop: '20' }}
              fullWidth={true}
              secondary={true}
            >login</button>
        </form>
      </div>
    );
  }
}


