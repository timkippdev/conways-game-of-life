import React from 'react';
import PropTypes from 'prop-types';

const Cell = props => {
  const { x, y, width } = props;
  return (
    <div
      className="cell"
      style={{
        left: `${width * x + 1}px`,
        top: `${width * y + 1}px`,
        width: `${width - 1}px`,
        height: `${width - 1}px`
      }}
    />
  );
};

Cell.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

export default Cell;
