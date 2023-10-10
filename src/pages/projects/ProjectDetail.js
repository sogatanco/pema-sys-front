import React, { useState } from 'react';
import ProjectDetailTab from './ProjectDetailTab';
import './ProjectDetail.scss';
import ProjectNav from './ProjectNav';
import { TaskContextProvider } from '../../context/TaskContext';

const ProjectDetail = () => {
  const [navActive, setNavActive] = useState(2);
  const [totalReview, setTotalReview] = useState(0);

  return (
    <TaskContextProvider>
      <>
        <ProjectNav {...{ navActive, setNavActive, totalReview }} />
        <ProjectDetailTab {...{ navActive, setTotalReview }} />
      </>
    </TaskContextProvider>
  );
};

export default ProjectDetail;
