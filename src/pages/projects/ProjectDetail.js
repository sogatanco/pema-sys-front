import React, { useState } from 'react';
import ProjectDetailTab from './ProjectDetailTab';
import './ProjectDetail.scss';
import ProjectNav from './ProjectNav';

const ProjectDetail = () => {
  const [navActive, setNavActive] = useState(1);
  return (
    <>
      <ProjectNav navActive={navActive} setNavActive={setNavActive} />
      <ProjectDetailTab navActive={navActive} />
    </>
  );
};

export default ProjectDetail;
