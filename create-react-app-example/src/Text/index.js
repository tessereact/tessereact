import React, { Component } from 'react';

class Text extends Component {
  render() {
    return (
      <span style={{color: this.props.color}}>{this.props.children}</span>
    );
  }
}

export default Text;
