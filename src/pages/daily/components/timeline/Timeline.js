import MaterialIcon from '@material/react-material-icon';
import React from 'react';
import './Timeline.scss';
import PropTypes from 'prop-types';

const Timeline = ({ dateRange }) => {
  return (
    <div className="timeline-container">
      <MaterialIcon icon="event"></MaterialIcon>
      <span>{dateRange}</span>
    </div>
  );
};

Timeline.propTypes = {
  dateRange: PropTypes.string,
};

export default Timeline;
