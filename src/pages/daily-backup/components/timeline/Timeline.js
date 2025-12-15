import MaterialIcon from '@material/react-material-icon';
import React from 'react';
import './Timeline.scss';
import PropTypes from 'prop-types';

const Timeline = ({ dateRange, isLate = false }) => {
  return (
    <div className="timeline-container">
      <MaterialIcon icon="event"></MaterialIcon>
      <span className={isLate ? 'text-danger' : ''}>{dateRange}</span>
    </div>
  );
};

Timeline.propTypes = {
  dateRange: PropTypes.string,
  isLate: PropTypes.bool,
};

export default Timeline;
