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
        <Col lg="12">
          <ProjectList />
        </Col>
        <Col lg="4">
          <TaskList title="Need Review" type="done" />
        </Col>
        <Col lg="4">
          <TaskList title="Inprogress Tasks" type="inprogress" />
        </Col>
        <Col lg="4">
          <TaskList title="Marked Tasks" type="marked" />
        </Col>
      </Row>
    </>
  );
};

export default Director;
