import React from 'react';
import PropTypes from 'prop-types';
import OverviewTab from './OverviewTab';
import BoardTab from './BoardTab';
import MemberTab from './MemberTab';
import FileTab from './FileTab';
import ReviewTab from './ReviewTab';
import HandoverTab from './HandoverTab';
import ActivityTab from './ActivityTab';
import ReviewBastTab from './ReviewBastTab';

const ProjectDetailTab = ({ navActive, setTotalReview, setTotalBastReview, roles }) => {
  return (
    <>
      {navActive === 1 && <OverviewTab />}
      {!roles.includes('Director') && navActive === 2 && <BoardTab />}
      {navActive === 3 && <MemberTab />}
      {navActive === 4 && <FileTab />}
      {navActive === 5 && <ReviewTab {...{ setTotalReview }} />}
      {!roles.includes('Director') && navActive === 6 && <HandoverTab />}
      {navActive === 7 && <ActivityTab />}
      {navActive === 8 && <ReviewBastTab {...{ setTotalBastReview }} />}
    </>
  );
};

ProjectDetailTab.propTypes = {
  navActive: PropTypes.any,
  setTotalReview: PropTypes.func,
  setTotalBastReview: PropTypes.func,
  roles: PropTypes.array,
};

export default ProjectDetailTab;
