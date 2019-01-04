import React from 'react';
import PropTypes from 'prop-types';

const WindowButton = ({
  onClick,
  type
}) => (
  <div
    className={`
      button
      button--${type}
    `}
    onClick={onClick}
  >
  </div>
)

WindowButton.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.string
}

WindowButton.defaultProps = {
  onClick: () => {},
  type: 'close'
}

export default WindowButton;
