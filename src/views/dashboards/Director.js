import React from 'react';
import { Col, Row } from 'reactstrap';
import ProjectList from './ProjectList';
import TopCards from './TopCards';
import TaskList from './TaskList';

const Director = () => {
  return (
    <>
      <TopCards />
      <Row>
        <Col lg="8">
          <ProjectList />
        </Col>
        <Col lg="4">
          <TaskList />
        </Col>
      </Row>
    </>
  );
};

export default Director;
