import React, { useEffect, useState } from 'react';
import ProjectDetailTab from './ProjectDetailTab';
import './ProjectDetail.scss';
import ProjectNav from './ProjectNav';
import { TaskContextProvider } from '../../context/TaskContext';
import useAuth from '../../hooks/useAuth';

const ProjectDetail = () => {
  const { auth } = useAuth();
  const { roles } = auth?.user;
  const [navActive, setNavActive] = useState(2);
  const [totalReview, setTotalReview] = useState(0);
  const [totalBastReview, setTotalBastReview] = useState(0);
  // const [isOwner, setIsOwner] = useState();

  useEffect(() => {
    if (roles.includes('Director')) {
      setNavActive(1);
    }
  }, [roles]);

  // const { data } = useQuery({
  //   queryKey: ['employe'],
  //   queryFn: () =>
  //     api.get(`api/employe/${auth?.user.employe_id}`).then((res) => {
  //       setIsOwner()
  //       return res.data.data;
  //     }),
  // });

  // console.log(data);

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
