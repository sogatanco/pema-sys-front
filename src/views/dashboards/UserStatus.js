import React from 'react';
import { Card, CardBody, Col } from 'reactstrap';

const UserStatus = () => {
  return (
    <>
      <Col md="6">
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <div className="me-3 align-self-center">
                <h1 className="text-muted">
                  <i className="bi bi-person-check"></i>
                </h1>
              </div>
              <div className="d-flex flex-column align-items-end">
                <span>Online</span>
                <h4 className="text-success">50</h4>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md="6">
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <div className="me-3 align-self-center">
                <h1 className="text-muted">
                  <i className="bi bi-person-x"></i>
                </h1>
              </div>
              <div className="d-flex flex-column align-items-end">
                <span>Offline</span>
                <h4 className="text-danger">29</h4>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default UserStatus;
