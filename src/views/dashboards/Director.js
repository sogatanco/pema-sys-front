import React from 'react';
import { Col, Row } from 'reactstrap';
import TopCardsData from '../../components/dashboard/dashboard2/TopCardsData';
import './Director.scss';
import ProjectList from './ProjectList';

const Director = () => {
  return (
    <>
      <Row>
        <Col sm="6" lg="3">
          <TopCardsData bg="primary" icon="wallet2" title="10" subtitle="Total Project" />
        </Col>
        <Col sm="6" lg="3">
          <TopCardsData bg="info" icon="list-task" title="60" subtitle="Total Task" />
        </Col>
        <Col sm="6" lg="3">
          <TopCardsData bg="warning" icon="clock-history" title="30" subtitle="Task In Progress" />
        </Col>
        <Col sm="6" lg="3">
          <TopCardsData bg="success" icon="check-circle" title="30" subtitle="Task Done" />
        </Col>
      </Row>
      <ProjectList />
    </>
  );
};

export default Director;
