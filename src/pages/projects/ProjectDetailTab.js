import React from 'react';
import PropTypes from 'prop-types';
import OverviewTab from './OverviewTab';
import BoardTab from './BoardTab';

const ProjectDetailTab = ({ navActive }) => {
  return (
    <>
      {navActive === 1 && <OverviewTab />}
      {navActive === 2 && <BoardTab />}
    </>
  );
};

ProjectDetailTab.propTypes = {
  navActive: PropTypes.any,
};

export default ProjectDetailTab;
