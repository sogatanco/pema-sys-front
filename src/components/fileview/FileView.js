import React from 'react';
import { Button, Col, Row } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';

const FileView = ({ title, filename }) => {
  return (
    <Row className="align-items-center mb-4">
      <span>{title}</span>
      <Col sm="12" lg="12">
        <div className="d-flex rounded-2 border align-items-center justify-content-between overflow-hidden">
          <div className="h-100 d-flex p-3 bg-success">
            <MaterialIcon icon="text_snippet" style={{ color: 'white' }} />
          </div>
          <div className="d-flex w-100 px-3">
            <span className="fw-bold">{filename}</span>
          </div>
          <div className="d-flex p-2">
            <Button type="button" color="light" block className="d-flex">
              Preview
            </Button>
          </div>
        </div>
      </Col>
      {/* <Col sm="12" lg="1">
        <Button type="button" block outline>
          Edit
        </Button>
      </Col> */}
    </Row>
  );
};

FileView.propTypes = {
  title: PropTypes.string,
  filename: PropTypes.string,
};

export default FileView;
