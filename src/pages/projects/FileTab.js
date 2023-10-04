import React from 'react';
import { Card, CardBody, Col, Table } from 'reactstrap';

const FileTab = () => {
  return (
    <Col>
      <Card>
        <CardBody>
          <Table className="no-wrap mt-3 align-middle" hover borderless style={{ zIndex: '-1' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Filename</th>
                <th>Date Added</th>
                <th>File Size</th>
                <th>Project</th>
              </tr>
            </thead>
            <tbody style={{ overflow: 'hidden' }}></tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>
  );
};

export default FileTab;
