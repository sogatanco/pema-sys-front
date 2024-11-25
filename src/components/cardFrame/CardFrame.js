import React from 'react';
import PropTypes from 'prop-types';
import './CardFrame.scss';

const CardFrame = ({ children, title }) => {
  return (
    <div className="card-frame">
      <h5 className="fw-bold">{title}</h5>
      <hr />
      {children}
    </div>
  );
};

CardFrame.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

export default CardFrame;
