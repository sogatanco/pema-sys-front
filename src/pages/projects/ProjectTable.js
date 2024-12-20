import { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Button, Table } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import MaterialIcon from '@material/react-material-icon';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NewProjectModal from './NewProjectModal';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import './ProjectTable.scss';
import IndoDate from '../../utils/IndoDate';
import isExpired from '../../utils/isExpired';

const ProjectTables = ({ nav }) => {
  const { auth } = useAuth();
  const [modal, setModal] = useState(false);
  // const [actionMenu, setActionMenu] = useState(undefined);

  const toggle = () => {
    setModal(!modal);
  };

  const api = useAxios();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      // api.get(`api/project`).then((res) => {
      api
        .get(
          `${
            nav === 1 || auth?.user.roles.includes('Director')
              ? 'api/project'
              : nav === 2
              ? `api/project/${auth?.user.employe_id}/list`
              : `api/project/manager/assigned/list`
          }`,
        )
        .then((res) => {
          return res.data.data;
        }),
  });

  useEffect(() => {
    refetch();
  }, [nav]);

  const allowedRoles = ['Staff', 'Manager'];

  return (
    <Card className="rounded-2">
      {nav === 1 || nav === 2 ? (
        <CardBody style={{ position: 'relative' }}>
          <Col className="d-flex justify-content-between mb-3" col="12">
            <div className="">
              <CardTitle tag="h5" className="fw-bold">
                {nav === 1 || auth?.user.roles.includes('Director') ? 'All' : 'My'} Project Listing
              </CardTitle>
              {/* <CardSubtitle className="mb-2 text-muted" tag="h6">
                Overview of the projects
              </CardSubtitle> */}
            </div>
            {auth?.user.roles.find((role) => allowedRoles?.includes(role)) && nav === 2 && (
              <div className="">
                <Button
                  className="btn d-flex gap-1 align-items-center"
                  outline
                  color="info"
                  onClick={toggle.bind(null)}
                  size="sm"
                >
                  <MaterialIcon icon="add" />
                  Create New Project
                </Button>
                <NewProjectModal {...{ modal, setModal, toggle, refetch }} />
              </div>
            )}
          </Col>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <h6>Loading...</h6>
            </div>
          ) : error ? (
            <div className="d-flex justify-content-center">
              <h6>Something went wrong.</h6>
            </div>
          ) : data.length > 0 ? (
            <Table
              className="no-wrap mt-0 align-middle"
              responsive
              hover
              style={{ fontSize: '13px' }}
            >
              <thead>
                <tr>
                  <th>No.</th>
                  <th style={{ minWidth: '400px' }}>Projects</th>
                  <th style={{ minWidth: '180px' }}>Numbers</th>
                  <th style={{ minWidth: '200px' }}>Levels</th>
                  <th style={{ minWidth: '120px' }}>Start date</th>
                  <th style={{ minWidth: '120px' }}>Due date</th>
                  <th>Status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody style={{ overflow: 'hidden' }}>
                {data?.map((p, i) => (
                  <tr key={p.project_id} className="border-top">
                    <td>{i + 1}.</td>
                    <td className="text-success">
                      <Link
                        className="fw-bold"
                        to={`details/${p.project_id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        {p.project_name}
                      </Link>
                      <br></br>
                      <span className="fs-7 text-muted fw-bold">{p.organization_name}</span>
                    </td>
                    <td className="text-muted">{p.project_number}</td>
                    <td className="text-muted">{p.level_desc}</td>
                    <td className="text-muted">{IndoDate(p.current_stage?.start_date)}</td>
                    <td
                      className={`${
                        isExpired(p.current_stage?.end_date) ? 'text-danger' : 'text-muted'
                      }`}
                    >
                      {IndoDate(p.current_stage?.end_date)}
                    </td>
                    <td>
                      {p?.category === 'business' ? (
                        <>
                          {p.status === 'new' && (
                            <span className="badge bg-light-info text-info rounded-pill d-inline-block fw-bold">
                              New
                            </span>
                          )}
                          {p.status === 'ongoing' && (
                            <span className="badge bg-light-primary text-primary rounded-pill d-inline-block fw-bold">
                              {p?.current_stage?.phase}
                            </span>
                          )}
                          {p.status === 'done' && (
                            <span className="badge bg-light-success text-success rounded-pill d-inline-block fw-bold">
                              Done
                            </span>
                          )}
                          {/* <td width="5" align="center">
                            {auth?.user.employe_id === p.created_by ? (
                              <div className="action-table">
                                <button
                                  type="button"
                                  className="btn"
                                  onClick={() => setActionMenu(p.project_id)}
                                >
                                  <MaterialIcon icon="more_vert" />
                                </button>
                                {actionMenu === p.project_id && (
                                  <>
                                    <div
                                      className="action-overlay"
                                      onClick={() => setActionMenu(undefined)}
                                    />
                                    <div className="action-options">
                                      <Link to={`details/${p.project_id}`} className="text-muted">
                                        <MaterialIcon icon="info" />
                                        Details
                                      </Link>
                                      <Link to="/" className="text-muted">
                                        <MaterialIcon icon="update" />
                                        Update
                                      </Link>
                                      <button
                                        type="button"
                                        className="text-muted"
                                        onClick={() => setActionMenu(undefined)}
                                      >
                                        <MaterialIcon icon="delete_outline" />
                                        Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              '-'
                            )}
                          </td> */}
                        </>
                      ) : (
                        <span className="badge bg-light-success text-success rounded-pill d-inline-block fw-bold">
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="d-flex justify-content-center">
              <h6>No project yet.</h6>
            </div>
          )}
        </CardBody>
      ) : (
        <CardBody style={{ position: 'relative' }}>
          <Col className="d-flex justify-content-between mb-3" col="12">
            <div className="">
              <CardTitle tag="h5" className="fw-bold">
                Project Assigned Listing
              </CardTitle>
            </div>
          </Col>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <h6>Loading...</h6>
            </div>
          ) : error ? (
            <div className="d-flex justify-content-center">
              <h6>Something went wrong.</h6>
            </div>
          ) : data.length > 0 ? (
            <Table
              className="no-wrap mt-0 align-middle"
              responsive
              hover
              style={{ fontSize: '13px' }}
            >
              <thead>
                <tr>
                  <th>No.</th>
                  <th style={{ minWidth: '400px' }}>Projects</th>
                  <th style={{ minWidth: '180px' }}>Numbers</th>
                  <th style={{ minWidth: '200px' }}>Levels</th>
                  <th style={{ minWidth: '120px' }}>Start date</th>
                  <th style={{ minWidth: '120px' }}>Due date</th>
                  <th>Status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody style={{ overflow: 'hidden' }}>
                {data?.map((p, i) => (
                  <tr key={p.project_id} className="border-top">
                    <td>{i + 1}.</td>
                    <td className="text-success">
                      <Link
                        className="fw-bold"
                        to={`details/${p.project_id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        {p.project_name}
                      </Link>
                      <br></br>
                      <span className="fs-7 text-muted fw-bold">{p.organization_name}</span>
                    </td>
                    <td className="text-muted">{p.project_number}</td>
                    <td className="text-muted">{p.level_desc}</td>
                    <td className="text-muted">{IndoDate(p.current_stage?.start_date)}</td>
                    <td
                      className={`${
                        isExpired(p.current_stage?.end_date) ? 'text-danger' : 'text-muted'
                      }`}
                    >
                      {IndoDate(p.current_stage?.end_date)}
                    </td>
                    <td>
                      {p?.category === 'business' ? (
                        <>
                          {p.status === 'new' && (
                            <span className="badge bg-light-info text-info rounded-pill d-inline-block fw-bold">
                              New
                            </span>
                          )}
                          {p.status === 'ongoing' && (
                            <span className="badge bg-light-primary text-primary rounded-pill d-inline-block fw-bold">
                              {p?.current_stage?.phase}
                            </span>
                          )}
                          {p.status === 'done' && (
                            <span className="badge bg-light-success text-success rounded-pill d-inline-block fw-bold">
                              Done
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="badge bg-light-success text-success rounded-pill d-inline-block fw-bold">
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="d-flex justify-content-center">
              <h6>No project yet.</h6>
            </div>
          )}
        </CardBody>
      )}
    </Card>
  );
};

ProjectTables.propTypes = {
  nav: PropTypes.number,
};

export default ProjectTables;
