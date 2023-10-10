import React from 'react';
import PropTypes from 'prop-types';
import OverviewTab from './OverviewTab';
import BoardTab from './BoardTab';
import MemberTab from './MemberTab';
import FileTab from './FileTab';
import ReviewTab from './ReviewTab';
import HandoverTab from './HandoverTab';

const ProjectDetailTab = ({ navActive, setTotalReview }) => {
  return (
    <>
      {navActive === 1 && <OverviewTab />}
      {navActive === 2 && <BoardTab />}
      {navActive === 3 && <MemberTab />}
      {navActive === 4 && <FileTab />}
      {navActive === 5 && <ReviewTab {...{ setTotalReview }} />}
      {navActive === 6 && <HandoverTab />}
    </>
  );
};

ProjectDetailTab.propTypes = {
  navActive: PropTypes.any,
  setTotalReview: PropTypes.func,
};

export default ProjectDetailTab;
