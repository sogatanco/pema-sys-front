import React from 'react';
import './FailedInformation.scss';
import MaterialIcon from '@material/react-material-icon';

const FailedInformation = () => {
  return (
    <div className="failed-information">
      <MaterialIcon icon="warning" className="icon" />
      <span>Failed to load data</span>
    </div>
  );
};

export default FailedInformation;
