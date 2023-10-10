import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import Newtask from './Newtask';


const Daily = () => {

  return (
    <>
      <Card>
        <CardBody className="p-4">
          {/* autocomplere */}
          <Newtask></Newtask>

          {/* end auto complete */}
        </CardBody>
      </Card>

      <Row>
        <Col>
          <Card>
            <CardBody>
              <h3>Todo</h3>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <h3>In Progress</h3>
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card>
            <CardBody>
              <h3>Done</h3>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Daily;
