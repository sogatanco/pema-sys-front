import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Card, CardBody, CardTitle, Col } from 'reactstrap';

const RequestItem = ({ title, data }) => {
  return (
    <Col lg="12">
      <Card className="">
        <CardBody className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <CardTitle tag="h4">{title}</CardTitle>
            <Link to="projects" style={{ textDecoration: 'none' }}></Link>
          </div>
          {data?.length > 0
            ? data.map((item) => (
                <div className="d-flex justify-content-between rounded-3 px-3 py-3 align-items-center text-dark bg-light">
                  <h4 className="fw-bold">{item.nama_perusahaan}</h4>
                  <div className="d-flex gap-3">
                    <Link to={`check/${item.id}`}>
                      <Button type="button" color="secondary">
                        Document
                      </Button>
                    </Link>
                    <Button type="button" color="secondary">
                      Email
                    </Button>
                    <Button type="button" color="secondary">
                      Approve
                    </Button>
                  </div>
                </div>
              ))
            : 'No data.'}
        </CardBody>
      </Card>
    </Col>
  );
};

RequestItem.propTypes = {
  title: PropTypes.string,
  data: PropTypes.array,
};

export default RequestItem;
