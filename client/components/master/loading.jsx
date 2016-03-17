'use strict';

import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import React, { Component } from 'react';

export default class Loading extends Component {

  render() {
    let styles = this.getStyles()
    return (
      <div style={styles.loading}>
        <div style={styles.loadIcon}>
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

  getStyles() {
    const styles = {
      loading: {
        position: 'fixed',
        width: '100%',
        height: '100vh',
        top: '0px',
        left: '0px',
        zIndex: 9999,
        backgroundColor: 'rgb(255,255,255)',
        opacity: '0.8',
      },
      loadIcon: {
        width: '100px',
        margin: '0px auto',
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
      }
    }
    return styles;
  }

}


