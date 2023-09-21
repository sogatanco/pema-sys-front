import React from 'react';
import { Col } from 'reactstrap';
import BoardTask from './BoardTask';

const BoardDone = () => {
  const data = {
    status: 'done',
  };

  return (
    <Col lg="4" className="mt-4">
      <h4>Done (1)</h4>
      <BoardTask data={data} />
    </Col>
  );
};

export default BoardDone;
