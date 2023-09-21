import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Table,
  Col,
  Button,
  Alert,
  Badge,
} from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import { Link } from 'react-router-dom';
import NewProjectModal from './NewProjectModal';
import useAxios from '../../hooks/useAxios';
import './Project.scss';

const ProjectTables = () => {
  const [modal, setModal] = useState(false);
  const [projects, setProjects] = useState();
  const [actionMenu, setActionMenu] = useState(undefined);
  const [successMsg, setSuccessMsg] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const toggle = () => {
    setModal(!modal);
  };

  const api = useAxios();

  useEffect(() => {
    async function fetchProjects() {
      await api
        .get(`project`)
        .then((res) => {
          setProjects(res.data.data);
        })
        .catch((err) => {
          console.log(err);
          // setErrorMsg(err.errors.messages);
        });
    }
    fetchProjects();
  }, [successMsg]);

  setTimeout(() => {
    if (successMsg) {
      setSuccessMsg();
    }
    if (errorMsg) {
      setErrorMsg();
    }
  }, 5000);

  return (
    <div>
      {(successMsg || errorMsg) && (
        <Alert color={successMsg ? 'info' : 'danger'}>{!errorMsg ? successMsg : errorMsg}</Alert>
      )}
      <Card>
        <CardBody style={{ position: 'relative' }}>
          <Col className="d-flex justify-content-between" col="12">
            <div className="">
              <CardTitle tag="h5">Project Listing</CardTitle>
              <CardSubtitle className="mb-2 text-muted" tag="h6">
                Overview of the projects
              </CardSubtitle>
            </div>
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
              <NewProjectModal {...{ modal, setModal, toggle, setSuccessMsg, setErrorMsg }} />
            </div>
          </Col>
          <Table className="no-wrap mt-3 align-middle" hover borderless style={{ zIndex: '-1' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Division</th>
                <th>Number</th>
                <th>Project</th>
                <th>Start</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody style={{ overflow: 'hidden' }}>
              {projects ? (
                projects.map((p, i) => (
                  <tr key={p.project_id} className="border-top">
                    <td>{i + 1}</td>
                    <td>{p.organization_name}</td>
                    <td>{p.project_number}</td>
                    <td>{p.project_name}</td>
                    <td>{`${p.start_date.split('-')[2]}-${p.start_date.split('-')[1]}-${
                      p.start_date.split('-')[0]
                    }`}</td>
                    <td>
                      {i === 0 && <Badge color="info">New</Badge>}
                      {i === 1 && <Badge color="warning">Ongoing</Badge>}
                      {i !== 0 && i !== 1 && <Badge color="success">Done</Badge>}
                    </td>
                    <td width="5" align="center">
                      <div className="action">
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
                ))
              ) : (
                <tr>
                  <td colSpan={5} height={20} style={{ textAlign: 'center' }}>
                    Loading ...
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProjectTables;
