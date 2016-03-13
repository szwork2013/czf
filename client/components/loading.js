'use strict';

import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import React, { Component } from 'react';

export default class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <div className="load-icon">
          <RefreshIndicator
            size={100}
            top={0}
            left={0}
            status="loading"
          />
        </div>
      </div>
    );
  }
}


