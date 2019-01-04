import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      style,
      content,
      position,
      ...htmlProps
    } = this.props;

    // Split string like 'top left' into its parts
    let positions = position.split(' ');

    return (
      <div
        style={{
          [positions[0]]: 0,
          [positions[1]]: 0,
          [`border${positions[0].charAt(0).toUpperCase() + positions[0].slice(1)}`]: 'none',
          [`border${positions[1].charAt(0).toUpperCase() + positions[1].slice(1)}`]: 'none',
          ...style
        }}
        className='menu'
        {...htmlProps}
      >
        { content }
      </div>
    )
  }
}

Menu.propTypes = {
  style: PropTypes.object,
  content: PropTypes.string,
  position: PropTypes.string,
}

Menu.defaultProps = {
  style: {},
  content: 'Menu',
  position: 'top left'
}

export default Menu;
