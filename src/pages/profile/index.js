import { Row, Col } from 'reactstrap';
import React from 'react';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ProfileCard from '../../components/dashboard/dashboard1/ProfileCard';
import Timeline from '../../components/dashboard/dashboard1/Timeline';

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
