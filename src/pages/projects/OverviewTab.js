import React from 'react';
import { Card, CardBody, CardTitle, Col, Progress, Row } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import user1 from '../../assets/images/users/user1.jpg';
import user2 from '../../assets/images/users/user2.jpg';

const OverviewTab = () => {
  return (
    <Row>
      <Col lg="8">
        <Card>
          <CardBody>
            <div>
              <CardTitle tag="h4" className="text-dark">
                Description
              </CardTitle>
            </div>
            <div className="ms-auto mt-3 mt-md-0">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni, doloremque ipsam!
              Rerum nostrum deleniti magnam, beatae quibusdam corrupti explicabo tempora dolorum
              amet mollitia optio quaerat aspernatur, dignissimos, eligendi enim et obcaecati
              deserunt sit possimus. Maiores, quaerat doloremque ipsum nisi quo veritatis accusamus
              laboriosam, maxime magni dolores eveniet dicta iusto sapiente.
            </div>
            <div className="d-flex justify-content-between mt-3">
              <div className="d-flex flex-column">
                <small className="text-muted">Level</small>
                <span className="text-dark">Mendesak</span>
              </div>
              <div className="d-flex flex-column">
                <small className="text-muted">Base</small>
                <div className="d-flex gap-2">
                  <span className="text-dark">Business Plan</span>
                  <i className="me-2 bi-info-circle-fill"></i>
                </div>
              </div>
              <div className="d-flex flex-column">
                <small className="text-muted">Start date</small>
                <span className="text-dark">12 Oktober 2023</span>
              </div>
              <div className="d-flex flex-column">
                <small className="text-muted">Deadline</small>
                <span className="text-dark">05 Desember 2023</span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-end">
              <div className="d-flex mt-3 gap-3 align-items-center">
                <img src={user1} className="rounded-circle" alt="avatar" width="45" height="45" />
                <div className="d-flex flex-column">
                  <small className="text-muted">Creator</small>
                  <span className="text-dark fw-bold">Si Fulan</span>
                  {/* <small className="text-muted">Divisi Teknologi & Informasi</small> */}
                </div>
              </div>
              <div className="d-flex gap-3">
                <span className="badge text-muted bg-light rounded-pill d-inline-block">
                  Est. Cost <strong style={{ fontSize: '12px' }}>Rp 145.000.000,00</strong>
                </span>
                <span className="badge text-muted bg-light rounded-pill d-inline-block">
                  Est. Income <strong style={{ fontSize: '12px' }}>Rp 200.000.000,00</strong>
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
              <div className="col-md-12 d-flex justify-content-between align-items-center">
                <div className="col-md-7 d-flex flex-column">
                  <span className="text-dark">Project Started</span>
                  <small>Divisi Migas, Minerba dan EBTKE</small>
                </div>
                <div className="col-md-3 d-flex flex-column">Mon, 21-09-2023 14:38</div>
                <div className="col-md-1 member">
                  <img src={user1} className="rounded-circle" alt="avatar" width="35" height="35" />
                  <img src={user2} className="rounded-circle" alt="avatar" width="35" height="35" />
                </div>
              </div>
              <div className="col-md-12 d-flex justify-content-between align-items-center">
                <div className="col-md-7 d-flex flex-column">
                  <span className="text-dark">Project Created</span>
                  <small>Divisi Migas, Minerba dan EBTKE</small>
                </div>
                <div className="col-md-3 d-flex flex-column">Thu, 11-09-2023 09:53</div>
                <div className="col-md-1 member">
                  <img src={user1} className="rounded-circle" alt="avatar" width="35" height="35" />
                </div>
              </div>
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
                  <h6 className="text-muted">Created Task</h6>
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
                  <h6 className="text-muted">Upcoming Task</h6>
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
