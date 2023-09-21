import React from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ProjectTables from './ProjectTable';

const index = () => {
  return (
    <>
      <BreadCrumbs />
      <ProjectTables />
    </>
  );
};

export default index;
