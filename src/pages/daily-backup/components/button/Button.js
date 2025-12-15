import React from 'react';
import './Button.scss';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';

const Button = ({ actionFn, color, icon, text, size, badge, badgeColor, badgeCount }) => {
  return (
    <button type="button" className={`button ${color} ${size || 'md'}`} onClick={actionFn}>
      <MaterialIcon icon={icon} />
      {text} {badge && <span className={`button-badge ${badgeColor}`}>{badgeCount}</span>}
    </button>
  );
};

Button.propTypes = {
  actionFn: PropTypes.func,
  color: PropTypes.string,
  icon: PropTypes.string,
  text: PropTypes.string,
  size: PropTypes.string,
  badge: PropTypes.bool,
  badgeColor: PropTypes.string,
  badgeCount: PropTypes.number,
};

export default Button;
