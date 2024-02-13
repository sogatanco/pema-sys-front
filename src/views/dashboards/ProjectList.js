import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardTitle, Col, Input, Row } from 'reactstrap';
import useAxios from '../../hooks/useAxios';
import CircularPercentage from '../../components/atoms/circularPercentage/CircularPercentage';
import user1 from '../../assets/images/users/user1.jpg';
import useAuth from '../../hooks/useAuth';
import IndoDate from '../../utils/IndoDate';

const ProjectList = () => {
  const { auth } = useAuth();
  const [divisions, setDivisions] = useState([]);
  const [list, setList] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState();
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['projectsdash'],
    queryFn: () =>
      api
        .get(
          `${
            auth?.user?.roles.includes('Director')
              ? 'api/project'
              : `api/project/${auth?.user.employe_id}/list`
          }`,
        )
        .then((res) => {
          setDivisions(res.data.divisions);
          const filtered = res.data.data.filter((item) => item.total_progress > 10);
          setList(filtered.reverse());
          setSelectedDivision('all');
          return filtered.reverse();
        }),
  });

  useEffect(() => {
    setList(
      selectedDivision === 'all'
        ? data
        : data?.filter((item) => item.division.toString() === selectedDivision),
    );
  }, [selectedDivision]);

  return (
    <Row>
      <Col lg="12">
        <Card className="">
          <CardBody className="d-flex flex-column gap-2" style={{ minHeight: '130px' }}>
            <Row lg="d-flex justify-content-between">
              <Col sm="12" md="6" lg="3">
                <CardTitle tag="h4">Projects Inprogress</CardTitle>
              </Col>
              <Col
                sm="12"
                md="6"
                lg="5"
                className="d-flex gap-2 align-items-end justify-content-end"
              >
                {auth?.user?.roles.includes('Director') && (
                  <div className="w-75">
                    <Input
                      type="select"
                      bsSize="sm"
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      value={selectedDivision}
                    >
                      <option value="all">All Division</option>
                      {divisions?.map((d) => (
                        <option key={d.organization_id} value={d.organization_id}>
                          {d.organization_name}{' '}
                        </option>
                      ))}
                    </Input>
                  </div>
                )}
                <div className="w-25">
                  <Link to="projects" style={{ textDecoration: 'none' }}>
                    <Button
                      type="button"
                      size="sm"
                      outline
                      color="info"
                      className="rounded-2"
                      block
                    >
                      {' '}
                      See all
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
            {isLoading ? (
              'Loading...'
            ) : error ? (
              'Something went wrong.'
            ) : (
              <>
                {list?.length > 0 ? (
                  list?.map(
                    (p, i) =>
                      i < 10 && (
                        <Link
                          key={p.project_id}
                          className="d-flex justify-content-between rounded-3 px-3 py-3 align-items-center link-item text-dark bg-light"
                          to={`projects/details/${p.project_id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <Col>
                            <Row lg="12">
                              <Col lg="6">
                                <Row>
                                  <Col
                                    sm="12 align-items-start justify-content-start"
                                    lg="1"
                                    className="my-auto"
                                  >
                                    <span className="text-muted">{i + 1}</span>
                                  </Col>
                                  <Col>
                                    <abbr title={p.project_name} style={{ textDecoration: 'none' }}>
                                      <span className="fw-bold" style={{ fontSize: '14px' }}>
                                        {p.project_name.trim().length > 40
                                          ? `${p.project_name.substring(0, 42)}...`
                                          : p.project_name}
                                      </span>
                                      <div>
                                        <span className="badge text-primary bg-light-primary rounded-pill d-inline-block">
                                          <small className="fw-bold">{p.organization_name}</small>
                                        </span>
                                      </div>
                                    </abbr>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg="2" className="my-auto" content="center">
                                <div style={{ marginBottom: '-7px' }}>
                                  <small className="text-muted" style={{ fontSize: '12px' }}>
                                    Deadline{' '}
                                  </small>
                                </div>
                                <small>{IndoDate(p.current_stage?.end_date)}</small>
                              </Col>
                              <Col lg="2" className="d-flex align-items-center">
                                <span
                                  className="badge text-info bg-light-info rounded-pill d-inline-block fw-bold"
                                  style={{ textTransform: 'capitalize' }}
                                >
                                  {p.category}
                                </span>
                              </Col>
                              <Col lg="1" className="d-flex align-items-center">
                                <div className="d-flex gap-1 justify-content-center align-items-center">
                                  <div className="circular-progress">
                                    <CircularPercentage
                                      data={parseInt(p.total_progress.toFixed(), 10)}
                                    />
                                  </div>
                                </div>
                              </Col>
                              <Col lg="1" className="my-auto px-2">
                                <img
                                  src={user1}
                                  className="rounded-circle"
                                  alt="avatar"
                                  width="45"
                                  height="45"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Link>
                      ),
                  )
                ) : (
                  <div className="d-flex justify-content-center">
                    <p className="text-muted">No data yet.</p>
                  </div>
                )}
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
