import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import MaterialIcon from '@material/react-material-icon';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import user1 from '../../assets/images/users/user1.jpg';
import './Project.scss';

const allowedRolesForReview = ['Manager', 'Director'];
const allowedRolesForBastReview = ['Director'];

const ProjectNav = ({ navActive, setNavActive, totalReview, totalBastReview }) => {
  const [currentTotalReview, setCurrentTotalReview] = useState('');
  const [currentTotalBastReview, setCurrentTotalBastReview] = useState(0);
  const { auth } = useAuth();
  const { roles } = auth.user;
  const api = useAxios();
  const { projectId } = useParams();
  const [actionMenu, setActionMenu] = useState(false);
  const [isBusiness, setIsBusiness] = useState();

  const queryParams = new URLSearchParams(window.location.search);

  const queryTo = queryParams.get('to');

  useEffect(() => {
    if (queryTo === 'review') {
      setNavActive(5);
    } else if (queryTo === 'handover') {
      setNavActive(6);
    } else if (queryTo === 'overview') {
      setNavActive(1);
    } else if (queryTo === 'activities') {
      setNavActive(7);
    } else if (queryTo === 'bast-review') {
      setNavActive(8);
    }
  }, [queryParams]);

  useEffect(() => {
    async function fetchTotalReview() {
      await api
        .get(`api/task/${projectId}/level1/review`)
        .then((res) => setCurrentTotalReview(res.data.data))
        .catch((err) => console.log(err));
    }
    if (roles?.find((role) => allowedRolesForReview.includes(role))) {
      fetchTotalReview();
    }
  }, [totalReview]);

  useEffect(() => {
    async function fetchTotalBastReview() {
      await api
        .get(`api/project/${projectId}/${auth?.user.employe_id}/bast/review`)
        .then((res) => {
          setCurrentTotalBastReview(res.data.data);
        })
        .catch((err) => console.log(err));
    }
    if (roles?.find((role) => allowedRolesForBastReview.includes(role))) {
      fetchTotalBastReview();
    }
  }, [totalBastReview]);

  const { isLoading, data } = useQuery({
    queryKey: ['project-number'],
    queryFn: () =>
      api.get(`api/project/${projectId}`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    if (data?.category === 'business') {
      setIsBusiness(true);
    } else {
      setIsBusiness(false);
    }
  }, [data]);

  const BoardAllowedRoles = ['Staff', 'Manager'];
  const MembersAllowedRoles = ['Staff', 'Manager', 'Director'];
  const ActivitiesAllowedRoles = ['Manager', 'Director'];
  const FilesAllowedRoles = ['Staff'];
  const BASTReviewAllowedRoles = ['Director'];
  const BASTAndReviewNotAllowedRoles = 'Presdir';
  const ReviewTaskAllowedRoles = ['Manager', 'Director'];
  const HandoverAllowedRoles = ['Manager'];

  return (
    <Col>
      <Col md="12" className="d-flex justify-content-between mb-3 align-items-center">
        <div className="project-nav">
          <Link
            className={`${navActive === 1 && 'active'} text-muted fw-bold`}
            onClick={() => setNavActive(1)}
          >
            Overview
          </Link>
          {auth?.user?.roles.find((role) => BoardAllowedRoles.includes(role)) && (
            <Link
              className={`${navActive === 2 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(2)}
            >
              Board
            </Link>
          )}
          {auth?.user?.roles.find((role) => ActivitiesAllowedRoles.includes(role)) && (
            <Link
              className={`${navActive === 7 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(7)}
            >
              Activities
            </Link>
          )}
          {auth?.user?.roles.find((role) => FilesAllowedRoles.includes(role)) && (
            <>
              <Link
                className={`${navActive === 4 && 'active'} text-muted fw-bold`}
                onClick={() => setNavActive(4)}
              >
                Files
              </Link>
            </>
          )}
          {auth?.user?.roles.find((role) => BASTReviewAllowedRoles.includes(role)) &&
            !auth?.user?.roles.includes(BASTAndReviewNotAllowedRoles) && (
              <Link
                className={`${navActive === 8 && 'active'} text-muted fw-bold`}
                onClick={() => setNavActive(8)}
              >
                BAST Review{' '}
                <div
                  color="danger"
                  className={`count ${
                    currentTotalBastReview ? 'bg-danger text-white' : 'bg-light text-dark'
                  }`}
                >
                  {currentTotalBastReview?.length}
                </div>
              </Link>
            )}
          {auth?.user?.roles.find((role) => ReviewTaskAllowedRoles.includes(role)) &&
            !auth?.user?.roles.includes(BASTAndReviewNotAllowedRoles) && (
              <>
                <Link
                  className={`${navActive === 5 && 'active'} text-muted fw-bold`}
                  onClick={() => setNavActive(5)}
                >
                  Review{' '}
                  <div
                    color="danger"
                    className={`count ${
                      currentTotalReview?.length > 0 ? 'bg-danger text-white' : 'bg-light text-dark'
                    }`}
                  >
                    {currentTotalReview?.length}
                  </div>
                </Link>
              </>
            )}
          {auth?.user?.roles.find((role) => HandoverAllowedRoles.includes(role)) && (
            <Link
              className={`${navActive === 6 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(6)}
            >
              Handover{' '}
            </Link>
          )}
          {auth?.user?.roles.find((role) => MembersAllowedRoles.includes(role)) && (
            <Link
              className={`${navActive === 3 && 'active'} text-muted fw-bold`}
              onClick={() => setNavActive(3)}
            >
              Members
            </Link>
          )}
        </div>
        <h3 className="fw-bold">{isLoading ? 'Loading..' : data?.project_number}</h3>
      </Col>

      <Card className="rounded-3 mb-3">
        <CardBody>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Row>
              <Col lg="8">
                <Row md="12">
                  <Col>
                    <h5 className="fw-bold">{data?.project_name}</h5>
                  </Col>
                </Row>
                {isBusiness ? (
                  <Row lg="12">
                    <Col sm="12" md="4">
                      <div className="d-flex align-items-center gap-2">
                        <MaterialIcon icon="manage_accounts" style={{ fontSize: '18px' }} />
                        <small>{data?.current_stage?.partner}</small>
                      </div>
                    </Col>
                    <Col sm="12" md="4">
                      <div className="d-flex align-items-center gap-2">
                        <MaterialIcon icon="handshake" style={{ fontSize: '18px' }} />
                        <small>
                          {data?.current_stage?.schema === 'jo'
                            ? 'Join Operational'
                            : data?.current_stage?.schema === 'jv'
                            ? 'Join Venture'
                            : '-'}
                        </small>
                      </div>
                    </Col>
                    <Col sm="12" md="4">
                      <div className="d-flex align-items-center gap-2">
                        <MaterialIcon icon="play_circle_outline" style={{ fontSize: '18px' }} />
                        <small>{data?.current_stage?.phase}</small>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row lg="12">
                    <div className="d-flex align-items-center gap-2">
                      <MaterialIcon icon="work_off" style={{ fontSize: '18px' }} />
                      <small>Non-business</small>
                    </div>
                  </Row>
                )}
              </Col>
              <Col lg="4" className="d-flex align-items-center justify-content-end">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="d-flex flex-column align-items-end"
                    style={{ marginLeft: '10px' }}
                  >
                    <small>{data?.pic_active.first_name}</small>
                    <span className="fw-bold" style={{ fontSize: '14px' }}>
                      {data?.pic_active.organization_name}
                    </span>
                    {/* {data?.category === 'business' && (
                      <span className="badge text-primary bg-light-primary rounded-pill d-inline-block fw-bold">
                        <div className="d-flex justify-content-center gap-1 align-items-center">
                          <MaterialIcon icon="play_circle_outline" style={{ fontSize: '12px' }} />
                          {data?.current_stage??.phase}
                        </div>
                      </span>
                    )} */}
                  </div>
                  <img src={user1} className="rounded-circle" alt="avatar" width="35" height="35" />
                  {auth?.user.first_name === data?.created_by ? (
                    <div className="action-table">
                      <button
                        type="button"
                        className="btn d-flex"
                        onClick={() => setActionMenu(true)}
                      >
                        <MaterialIcon icon="more_vert" />
                      </button>
                      {actionMenu && (
                        <>
                          <div className="action-overlay" onClick={() => setActionMenu(false)} />
                          <div className="action-options">
                            <Link to="/" className="text-muted">
                              <MaterialIcon icon="update" />
                              Update
                            </Link>
                            <button
                              type="button"
                              className="text-muted fw-bold"
                              onClick={() => setActionMenu(undefined)}
                            >
                              <MaterialIcon icon="delete" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </Col>
            </Row>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

ProjectNav.propTypes = {
  navActive: PropTypes.any,
  setNavActive: PropTypes.func,
  totalReview: PropTypes.number,
  totalBastReview: PropTypes.number,
};

export default ProjectNav;
