import React from 'react';
import './Label.scss';
import PropTypes from 'prop-types';

const Label = ({ color, text }) => {
  return (
    <div className={`label-container ${color}`}>
      <span className="label-text">{text}</span>
    </div>
  );
};

Label.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string,
};

export default Label;
