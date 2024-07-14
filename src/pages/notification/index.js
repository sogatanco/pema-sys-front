import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';

const index = () => {
  return (
    <Card className="rounded-3">
      <CardBody>
        <CardTitle tag="h4" className="fw-bold">
          Notifications
        </CardTitle>
        <div className="text-center">Available soon.</div>
      </CardBody>
    </Card>
  );
};

export default index;
