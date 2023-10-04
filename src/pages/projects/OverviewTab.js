import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Progress, Row } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import MaterialIcon from '@material/react-material-icon';
import { useParams } from 'react-router-dom';
import user1 from '../../assets/images/users/user1.jpg';
import useAxios from '../../hooks/useAxios';

const OverviewTab = () => {
  const { projectId } = useParams();
  const [history, setHistory] = useState();

  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['overview'],
    queryFn: () =>
      api.get(`/project/${projectId}`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    async function fetsHistory() {
      await api
        .get(`project/${projectId}/history`)
        .then((res) => setHistory(res.data.data))
        .catch((err) => console.log(err));
    }

    fetsHistory();
  }, [projectId]);

  const newDate = (date) => {
    const timestamp = new Date(date);
    const dateString = timestamp.toDateString();
    const localeString = timestamp.toLocaleString();
    return `${dateString}, ${localeString.split(',')[1]}`;
  };

  return isLoading ? (
    'Loading...'
  ) : error ? (
    'Soemthing went wrong.'
  ) : (
    <Row>
      <Col lg="8">
        <Card>
          <CardBody>
            <div>
              <CardTitle tag="h4" className="text-dark">
                Description
              </CardTitle>
            </div>
            <div className="ms-auto mt-3 mt-md-0">{data.goals}</div>
            <div className="d-flex justify-content-between mt-3">
              <div className="d-flex flex-column">
                <small className="text-muted">Level</small>
                <span className="text-dark">{data.level_desc}</span>
              </div>
              <div className="d-flex flex-column col-4">
                <small className="text-muted">Base</small>
                <div className="d-flex">
                  <span className="text-dark">{data.base_description}</span>
                  <i className="me-2 bi-info-circle-fill"></i>
                </div>
              </div>
              <div className="d-flex flex-column">
                <small className="text-muted">Start date</small>
                <span className="text-dark">{data.start_date}</span>
              </div>
              <div className="d-flex flex-column">
                <small className="text-muted">Deadline</small>
                <span className="text-dark">{data.end_date}</span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-end">
              <div className="d-flex mt-3 gap-3 align-items-center">
                <img src={user1} className="rounded-circle" alt="avatar" width="45" height="45" />
                <div className="d-flex flex-column">
                  <small className="text-muted">PIC</small>
                  <span className="text-dark fw-bold">{data.pic.first_name}</span>
                  {/* <small className="text-muted">Divisi Teknologi & Informasi</small> */}
                </div>
              </div>
              <div className="d-flex gap-3">
                <span className="badge text-muted bg-light rounded-pill d-inline-block">
                  Est. Cost <strong style={{ fontSize: '12px' }}>Rp {data.estimated_cost}</strong>
                </span>
                <span className="badge text-muted bg-light rounded-pill d-inline-block">
                  Est. Income{' '}
                  <strong style={{ fontSize: '12px' }}>Rp {data.estimated_income}</strong>
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div>
              <CardTitle tag="h4" className="text-dark">
                Project Statistics
              </CardTitle>
            </div>
            <div className="d-flex flex-column gap-3">
              {history?.map((h) => (
                <div
                  key={h.history_id}
                  className="col-md-12 d-flex justify-content-between align-items-center"
                >
                  <div className="col-md-7 d-flex flex-column">
                    <span className="text-dark">{h.history_desc}</span>
                    <small>{h.organization_name}</small>
                  </div>
                  <div className="col-md-3 d-flex flex-column">
                    <small>{newDate(h.created_at)}</small>
                  </div>
                  <div className="col-md-1 member">
                    <img
                      src={h.img || user1}
                      className="rounded-circle"
                      alt="avatar"
                      width="35"
                      height="35"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col lg="4">
        <Card>
          <CardBody>
            <CardTitle tag="h4" className="d-flex justify-content-between">
              Overall Process
              <span>76%</span>
            </CardTitle>
            <Progress className="mb-3" color="success" value="76" style={{ height: '15px' }} />
            <div className="overall-process">
              <div className="overall-child">
                <div>
                  <h6 className="text-muted">Time Remaining</h6>
                  <span className="text-danger">12</span>
                </div>
                <MaterialIcon icon="timer"></MaterialIcon>
              </div>
              <div className="overall-child">
                <div>
                  <h6 className="text-muted">Task Todo</h6>
                  <span>30</span>
                </div>
                <MaterialIcon icon="task_alt"></MaterialIcon>
              </div>
            </div>
            <div className="overall-process">
              <div className="overall-child">
                <div>
                  <h6 className="text-muted">Task In Progress</h6>
                  <span>10</span>
                </div>
                <MaterialIcon icon="play_circle_outline"></MaterialIcon>
              </div>
              <div className="overall-child">
                <div>
                  <h6 className="text-muted">Task Done</h6>
                  <span>5</span>
                </div>
                <MaterialIcon icon="schedule"></MaterialIcon>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle tag="h4">Recent Activity</CardTitle>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-3">
                <div className="act-list" />
                <div className="d-flex flex-column">
                  <span className="text-muted">Jaka joined the project</span>
                  <span className="text-muted" style={{ fontSize: '10px' }}>
                    1 day ago
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="act-list" />
                <div className="d-flex flex-column">
                  <span className="text-dark">Doni comment on your task </span>
                  <span className="text-muted" style={{ fontSize: '10px' }}>
                    1 day ago
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="act-list" />
                <div className="d-flex flex-column">
                  <span className="text-muted">Lexa uploaded the file</span>
                  <span className="text-muted" style={{ fontSize: '10px' }}>
                    2 day ago
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="act-list" />
                <div className="d-flex flex-column">
                  <span className="text-dark">Charlie assign a new task to you</span>
                  <span className="text-muted" style={{ fontSize: '10px' }}>
                    2 day ago
                  </span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default OverviewTab;
