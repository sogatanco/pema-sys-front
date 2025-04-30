import React from 'react';
import './NoDataYet.scss';
import MaterialIcon from '@material/react-material-icon';

const NoDataYet = () => {
  return (
    <div className="no-data-yet">
      <MaterialIcon icon="info" className="icon" />
      <span>No data yet</span>
    </div>
  );
};

export default NoDataYet;
