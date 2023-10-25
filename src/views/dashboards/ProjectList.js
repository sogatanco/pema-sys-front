import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import useAxios from '../../hooks/useAxios';
import CircularPercentage from '../../components/atoms/circularPercentage/CircularPercentage';
import user1 from '../../assets/images/users/user1.jpg';

const ProjectList = () => {
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      api.get(`api/project`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <Row>
      <Col lg="12">
        <Card className="">
          <CardBody className="d-flex flex-column gap-2">
            {isLoading ? (
              'Loading...'
            ) : error ? (
              'Something went wrong.'
            ) : (
              <>
                <CardTitle tag="h4">Projects</CardTitle>
                {data?.map((p, i) => (
                  <Link
                    key={p.project_id}
                    className="d-flex justify-content-between rounded-3 px-3 py-3 align-items-center project-item text-dark bg-light"
                    to={`projects/details/${p.project_id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="d-flex col-md-6 gap-3 align-items-center">
                      <span>{i + 1}</span>
                      <div className="d-flex flex-column">
                        <abbr title={p.project_name} style={{ textDecoration: 'none' }}>
                          <span className="fw-bold" style={{ fontSize: '14px' }}>
                            {p.project_name.trim().length > 40
                              ? `${p.project_name.substring(0, 42)}...`
                              : p.project_name}
                          </span>
                          <div>
                            <span className="badge text-primary bg-light-primary rounded-pill d-inline-block">
                              <small>{p.organization_name}</small>
                            </span>
                          </div>
                        </abbr>
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <small className="text-muted" style={{ fontSize: '12px' }}>
                        Deadline{' '}
                      </small>
                      <small>{p.end_date}</small>
                    </div>
                    <span className="badge text-info bg-light-info rounded-pill d-inline-block">
                      {p.status}
                    </span>
                    <div className="d-flex gap-1 justify-content-center align-items-center">
                      {/* <div className="d-flex flex-column">
                        <small>Progress</small>
                      </div> */}
                      <div className="circular-progress">
                        <CircularPercentage data={45} />
                      </div>
                    </div>
                    <div className="">
                      <img
                        src={user1}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <span>{p.first_name}</span>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </CardBody>
        </Card>
      </Col>
      {/* <Col lg="4">
          <Card>
            <CardBody></CardBody>
          </Card>
        </Col> */}
    </Row>
  );
};

export default ProjectList;
