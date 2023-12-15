import React from 'react';
import PropTypes from 'prop-types';
import './RoundedTable.scss';

const RoundedTable = ({ children }) => {
  return <table className="rounded-corners">{children}</table>;
};

RoundedTable.propTypes = {
  children: PropTypes.element,
};

export default RoundedTable;
