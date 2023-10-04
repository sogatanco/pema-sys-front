import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

const Project = () => {
  return (
    <Card className="bg-success">
      <CardBody>
        <div className="d-flex align-items-center">
          <div className="me-3 align-self-center">
            <h1 className="text-dark-white">
              <i className="bi bi-card-list"></i>
            </h1>
          </div>
          <div>
            <h4 className="text-dark-white">Project</h4>
          </div>
        </div>
        <Row>
          <Col xs={12} className="d-flex align-items-center justify-content-between mb-2">
            <h4 className="text-dark-white text-truncate mb-0">Project A</h4>
            <span className="text-dark-white fw-bold">35%</span>
          </Col>
          <Col xs={12} className="d-flex align-items-center justify-content-between mb-2">
            <h4 className="text-dark-white text-truncate mb-0">Project B</h4>
            <span className="text-dark-white fw-bold">75%</span>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Project;
