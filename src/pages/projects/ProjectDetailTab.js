import React from 'react';
import PropTypes from 'prop-types';
import OverviewTab from './OverviewTab';
import BoardTab from './BoardTab';
import MemberTab from './MemberTab';
import FileTab from './FileTab';

const ProjectDetailTab = ({ navActive }) => {
  return (
    <>
      {navActive === 1 && <OverviewTab />}
      {navActive === 2 && <BoardTab />}
      {navActive === 3 && <MemberTab />}
      {navActive === 4 && <FileTab />}
    </>
  );
};

ProjectDetailTab.propTypes = {
  navActive: PropTypes.any,
};

export default ProjectDetailTab;
