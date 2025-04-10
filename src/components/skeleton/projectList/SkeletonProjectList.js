import React from 'react';
import './style.scss';
import PropTypes from 'prop-types';

const SkeletonProjectList = ({ listLength, height }) => {
  return (
    <div className="skeleton-project-list">
      {[...Array(listLength)].map(() => (
        <div className="skeleton-card">
          <div className={`skeleton-image ${height}`}></div>
        </div>
      ))}
    </div>
  );
};

SkeletonProjectList.propTypes = {
  listLength: PropTypes.number,
  height: PropTypes.string,
};

export default SkeletonProjectList;
