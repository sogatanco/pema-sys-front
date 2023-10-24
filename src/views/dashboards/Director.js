import React from 'react';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import TopCardsData from '../../components/dashboard/dashboard2/TopCardsData';
import user1 from '../../assets/images/users/user1.jpg';
import useAxios from '../../hooks/useAxios';
import CircularPercentage from '../../components/atoms/circularPercentage/CircularPercentage';
import './Director.scss';

const Director = () => {
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      api.get(`api/project`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <>
      <Row>
        <Col sm="6" lg="3">
          <TopCardsData bg="primary" icon="wallet2" title="10" subtitle="Total Project" />
        </Col>
        <Col sm="6" lg="3">
          <TopCardsData bg="info" icon="list-task" title="60" subtitle="Total Task" />
        </Col>
        <Col sm="6" lg="3">
          <TopCardsData bg="warning" icon="clock-history" title="30" subtitle="Task In Progress" />
        </Col>
        <Col sm="6" lg="3">
          <TopCardsData bg="success" icon="check-circle" title="30" subtitle="Task Done" />
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <Card>
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
                      className="d-flex justify-content-between bg-light rounded-3 px-3 py-3 align-items-center project-item text-dark"
                      to={`projects/details/${p.project_id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="d-flex col-md-4 gap-3 align-items-center">
                        <span>{i + 1}</span>
                        <div className="d-flex flex-column">
                          <span className="fw-bold">{p.project_name}</span>
                          <span className="badge text-primary bg-light-primary rounded-pill d-inline-block">
                            <small>{p.organization_name}</small>
                          </span>
                        </div>
                      </div>
                      <div className="d-flex flex-column">
                        <small className="text-muted">Start at</small>
                        <small>{p.start_date}</small>
                      </div>
                      <span className="badge text-info bg-light-info rounded-pill d-inline-block">
                        {p.status}
                      </span>
                      <div className="d-flex gap-1 justify-content-center align-items-center">
                        <div className="d-flex flex-column">
                          <small>Progress</small>
                        </div>
                        <div className="circular-progress">
                          <CircularPercentage data="45" />
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
    </>
  );
};

export default Director;
