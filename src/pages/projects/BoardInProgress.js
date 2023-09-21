import React from 'react';
import { Col } from 'reactstrap';
import BoardTask from './BoardTask';

const BoardInProgress = () => {
  const data = {
    status: 'inprogress',
  };

  return (
    <Col lg="4" className="mt-4">
      <h4>In Progress (1)</h4>
      <BoardTask data={data} />
    </Col>
  );
};

export default BoardInProgress;
