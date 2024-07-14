import { Row, Col } from 'reactstrap';
import React from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import Timeline from './Timeline';
import ProfileCard from './ProfileCard';

const index = () => {
  return (
    <>
      <BreadCrumbs />
      <Row>
        <Col lg="4">
          <ProfileCard />
        </Col>
        <Col lg="8">
          <Timeline />
        </Col>
      </Row>
    </>
  );
};

export default index;
