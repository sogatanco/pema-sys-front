import React from 'react';
import PropTypes from 'prop-types';

const DataTable = ({ children }) => {
  return <div>{children}</div>;
};

DataTable.propTypes = {
  children: PropTypes.element,
};

export default DataTable;
