import { useState } from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, Table, Col, Button } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import MaterialIcon from '@material/react-material-icon';
import { Link } from 'react-router-dom';
import NewProjectModal from './NewProjectModal';
import useAxios from '../../hooks/useAxios';
import './Project.scss';
import useAuth from '../../hooks/useAuth';

const ProjectTables = () => {
  const { auth } = useAuth();
  const [modal, setModal] = useState(false);
  const [actionMenu, setActionMenu] = useState(undefined);

  const toggle = () => {
    setModal(!modal);
  };

  const api = useAxios('api');

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () =>
      api.get(`api/project`).then((res) => {
        return res.data.data;
      }),
  });

  const allowedRoles = ['Staff', 'Manager'];

  console.log(data);

  return (
    <div>
      <Card>
        <CardBody style={{ position: 'relative' }}>
          <Col className="d-flex justify-content-between" col="12">
            <div className="">
              <CardTitle tag="h5">Project Listing</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Overview of the projects
              </CardSubtitle>
            </div>
            {auth?.user.roles.find((role) => allowedRoles?.includes(role)) && (
              <div className="">
                <Button
                  className="btn d-flex gap-1 align-items-end"
                  outline
                  color="info"
                  onClick={toggle.bind(null)}
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
            <Table className="no-wrap mt-3 align-middle" hover borderless style={{ zIndex: '-1' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Projects</th>
                  <th>Numbers</th>
                  <th>Levels</th>
                  <th>Start at</th>
                  <th>Status</th>
                  <th>Action</th>
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
                    <td className="text-muted">{`${p?.start_date?.split('-')[2]}-${
                      p?.start_date?.split('-')[1]
                    }-${p?.start_date?.split('-')[0]}`}</td>
                    <td>
                      {p.status === 'new' && (
                        <span className="badge bg-light-info text-info rounded-pill d-inline-block fw-bold">
                          New
                        </span>
                      )}
                      {p.status === 'ongoing' && (
                        <span className="badge bg-light-primary text-primary rounded-pill d-inline-block fw-bold">
                          Ongoing
                        </span>
                      )}
                      {p.status === 'done' && (
                        <span className="badge bg-light-success text-success rounded-pill d-inline-block fw-bold">
                          Done
                        </span>
                      )}
                    </td>
                    <td width="5" align="center">
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
                              {/* <Link to={`tasks/${p.project_id}`} className="text-muted">
                                Create Task
                              </Link> */}
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
      </Card>
    </div>
  );
};

export default ProjectTables;
