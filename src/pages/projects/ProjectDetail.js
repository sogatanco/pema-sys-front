import React, { useEffect, useState } from 'react';
import ProjectDetailTab from './ProjectDetailTab';
import './ProjectDetail.scss';
import ProjectNav from './ProjectNav';
import { TaskContextProvider } from '../../context/TaskContext';
import useAuth from '../../hooks/useAuth';

const ProjectDetail = () => {
  const { auth } = useAuth();
  const { roles } = auth.user;
  const [navActive, setNavActive] = useState(2);
  const [totalReview, setTotalReview] = useState(0);
  const [totalBastReview, setTotalBastReview] = useState(0);

  useEffect(() => {
    if (roles.includes('Director')) {
      setNavActive(1);
    }
  }, [roles]);

  return (
    <TaskContextProvider>
      <>
        <ProjectNav {...{ navActive, setNavActive, totalReview, totalBastReview }} />
        <ProjectDetailTab {...{ navActive, setTotalReview, setTotalBastReview }} />
      </>
    </TaskContextProvider>
  );
};

export default ProjectDetail;
