import React from 'react';
import './Check.scss';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';

const Check = ({ checked, action, disabled }) => {
  return (
    <div
      className={`check-box ${checked && !disabled ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? null : action}
    >
      {checked && <MaterialIcon icon="check" className="check-icon" />}
    </div>
  );
};

Check.propTypes = {
  checked: PropTypes.bool,
  action: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Check;
