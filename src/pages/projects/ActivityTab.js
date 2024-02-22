import React, { Fragment, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Badge, Button, Card, CardBody, Col, Input, Row, Spinner } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import useAxios from '../../hooks/useAxios';
import TaskPopup from './TaskPopup';
import user1 from '../../assets/images/users/user1.jpg';
import useAuth from '../../hooks/useAuth';
import { alert } from '../../components/atoms/Toast';
import PDFFile from './PDFFile';
import TooltipHover from '../../components/atoms/TooltipHover';
import './ProjectTable.scss';
// import TooltipHover from '../../components/atoms/TooltipHover';

// const result = (emId) =>
//   emId.filter(
//     (person, index) => index === emId.findIndex((other) => person.employe_id === other.employe_id),
//   );

const ActivityTab = () => {
  const { auth } = useAuth();
  const { projectId } = useParams();
  const [modal, setModal] = useState(false);
  const [task, setTask] = useState(undefined);
  const [taskIdSelected, setTaskIdSelected] = useState();
  const [addingFavorite, setAddingFavorite] = useState();
  const [isDirector, setIsDirector] = useState(false);
  const [projectTitle, setProjectTitle] = useState();
  const [filterSearch, setFilterSearch] = useState();
  const api = useAxios();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['act'],
    queryFn: () =>
      api.get(`api/task/${projectId}/activities/all${search}`).then((res) => {
        setProjectTitle(res.data.project);
        return res.data.data;
      }),
  });

  useEffect(() => {
    setFilterSearch(data);
  }, [data]);

  const toggle = () => {
    setModal(!modal);
  };

  const openPopup = (selectedTask) => {
    setModal(true);
    setTask(selectedTask);
  };

  const handleFavorite = async (taskId) => {
    setTaskIdSelected(taskId);
    setAddingFavorite(true);
    await api
      .post(`api/task/${auth?.user.employe_id}/${taskId}/favorite`)
      .then((res) => {
        refetch();
        alert('success', res.data.message);
      })
      .catch(() => {
        alert('error', 'Something went wrong.');
      });
    setTaskIdSelected();
    setAddingFavorite(false);
  };

  const favoriteAllowedRoles = ['Director'];
  const reportTaskAllowedRoles = ['Manager'];

  useEffect(() => {
    if (auth?.user.roles.find((role) => favoriteAllowedRoles.includes(role))) {
      setIsDirector(true);
    }
  }, [auth]);

  const handleSearch = (value) => {
    const filterByTitle = data.filter((item) =>
      item.task_title.toLowerCase().includes(value.toLowerCase()),
    );

    setFilterSearch(filterByTitle);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Col>
        <Card className="rounded-3">
          <CardBody>
            {isLoading ? (
              'loading...'
            ) : error ? (
              'Something went wrong.'
            ) : (
              <>
                <Row>
                  <Col sm="12 mb-2" md="6">
                    <div className="d-flex gap-2">
                      <Button
                        type="button"
                        className="d-flex align-items-center gap-2 rounded-3"
                        color="light"
                        size="sm"
                      >
                        <MaterialIcon icon="filter_list" style={{ fontSize: '12px' }} />
                        Sort
                      </Button>
                      <Button
                        type="button"
                        className="d-flex align-items-center gap-2 rounded-3"
                        color="light"
                        size="sm"
                      >
                        <MaterialIcon icon="tune" style={{ fontSize: '12px' }} />
                        Filters
                      </Button>
                    </div>
                  </Col>
                  <Col sm="12" md="6">
                    <div className="d-flex gap-3 col-md-6 w-100">
                      <div className="w-100 position-relative">
                        <Input
                          type="text"
                          className="rounded-3"
                          bsSize="md"
                          placeholder="Search task..."
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                        <div className="position-absolute top-0 end-0 h-100 p-1">
                          <Button
                            type="button"
                            className="btn btn-light w-100 h-100 border-0 rounded-3 text-muted"
                            aria-describedby={id}
                            variant="contained"
                            onClick={handleClick}
                          >
                            <MaterialIcon icon="more_horiz" style={{ fontSize: '16px' }} />
                          </Button>
                          <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClick={handleClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                            }}
                          >
                            <Typography sx={{ p: 2 }}>
                              <Col>
                                <Row>
                                  <Link to="#">Task</Link>
                                </Row>
                                <Row>
                                  <Link to="#">Employee</Link>
                                </Row>
                                <Row>
                                  <Link to="#">Date</Link>
                                </Row>
                              </Col>
                            </Typography>
                          </Popover>
                        </div>
                      </div>
                      {auth?.user.roles.find((role) => reportTaskAllowedRoles.includes(role)) && (
                        <PDFDownloadLink
                          document={<PDFFile {...{ projectTitle, data }} />}
                          fileName={`Task Report - ${projectTitle?.project_number} - ${projectTitle?.division}`}
                          style={{ textDecoration: 'none' }}
                        >
                          {/* {({ loading }) =>
                          loading ? (
                            <Button
                              type="button"
                              size="sm"
                              className="btn btn-light d-flex rounded-3"
                            >
                              Loading...
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              className="btn btn-light-info text-info d-flex align-items-center gap-2 rounded-3"
                            >
                              <MaterialIcon icon="picture_as_pdf" style={{ fontSize: '12px' }} />
                              Report
                            </Button>
                          )
                        } */}
                          <Button
                            type="button"
                            className="btn btn-light-info text-info rounded-3 d-flex py-2"
                            // size="lg"
                          >
                            <MaterialIcon icon="file_download" style={{ fontSize: '18px' }} />
                            {/* Report */}
                          </Button>
                        </PDFDownloadLink>
                      )}
                    </div>
                  </Col>
                </Row>
                <Col sm="12 overflow-auto">
                  <h6 className="fw-bold mt-3">List of tasks from {projectTitle?.division}</h6>
                  <table className="rounded-corners" style={{ fontSize: '13px' }}>
                    <thead>
                      <tr>
                        <th width="30">#</th>
                        <th>Task title</th>
                        <th width="">Status</th>
                        <th>Progress</th>
                        <th width="100">PIC</th>
                        {isDirector && <th width="50"></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filterSearch?.length > 0 ? (
                        filterSearch?.map((ts, idx) => (
                          <Fragment key={ts.task_id}>
                            <tr>
                              <td>{idx + 1}.</td>
                              <td style={{ cursor: 'pointer' }} onClick={() => openPopup(ts)}>
                                <span style={{ fontWeight: '600' }}>{ts.task_title}</span>
                                <br></br>
                                <Badge color="light" className="text-muted">
                                  {ts?.subtasks?.length} subtask
                                </Badge>
                                {'  '}
                                <Badge color="light" className="text-muted">
                                  <MaterialIcon icon="comment" style={{ fontSize: '12px' }} />
                                  {ts.comments}
                                </Badge>
                              </td>
                              <td>
                                {ts.status === 0 ? (
                                  <Badge color="light" className="text-dark">
                                    To Do
                                  </Badge>
                                ) : ts.status === 1 ? (
                                  <Badge color="warning">In Progress</Badge>
                                ) : ts.status === 2 ? (
                                  <Badge color="light" className="text-dark">
                                    Under Review
                                  </Badge>
                                ) : ts.status === 3 ? (
                                  <Badge color="success">Approved</Badge>
                                ) : (
                                  <Badge color="danger">Revision</Badge>
                                )}
                              </td>
                              <td>
                                <span className="badge bg-light-success text-primary rounded-pill d-inline-block fw-bold">
                                  {ts?.task_progress?.toFixed()}%
                                </span>
                              </td>
                              <td>
                                <div className="members">
                                  <div className="members-item">
                                    {ts?.pics?.map(
                                      (pic, i) =>
                                        i < 2 && (
                                          <Fragment key={pic.id}>
                                            <img
                                              id={`tooltip-${pic.id}`}
                                              src={user1}
                                              className="ava-pic rounded-circle"
                                              alt="avatar"
                                              width="35"
                                              height="35"
                                            />
                                            <TooltipHover
                                              title={pic.first_name}
                                              id={pic.id?.toString()}
                                            />
                                          </Fragment>
                                        ),
                                    )}
                                    {ts?.pics?.length > 2 && (
                                      <div className="member-plus bg-light-info text-info fw-bold">
                                        +{ts.pics.length - 2}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              {isDirector && (
                                <td className="text-center">
                                  {addingFavorite && taskIdSelected === ts.task_id ? (
                                    <Spinner size="sm" color="warning" />
                                  ) : (
                                    <abbr title="Mark task" style={{ textDecoration: 'none' }}>
                                      <button
                                        type="button"
                                        className="fav-btn"
                                        onClick={() => handleFavorite(ts.task_id)}
                                      >
                                        <MaterialIcon
                                          icon="star"
                                          className={`${ts.isFavorite && 'is_favorite'}`}
                                        />
                                      </button>
                                    </abbr>
                                  )}
                                </td>
                              )}
                            </tr>
                            {ts.subtasks.length > 0 &&
                              ts.subtasks.map((st) => (
                                <tr key={st.task_id}>
                                  <td></td>
                                  <td onClick={() => openPopup(st)} style={{ cursor: 'pointer' }}>
                                    {st.task_title}
                                    <br></br>
                                    <Badge color="light" className="text-muted">
                                      <MaterialIcon icon="comment" style={{ fontSize: '12px' }} />
                                      {st.comments}
                                    </Badge>
                                  </td>

                                  <td>
                                    {/* {st.status === 0 ? (
                                <Badge color="light" className="text-dark">
                                  To Do
                                </Badge>
                              ) : st.status === 1 ? (
                                <Badge color="warning">In Progress</Badge>
                              ) : st.status === 2 ? (
                                <Badge color="light" className="text-dark">
                                  Under Review
                                </Badge>
                              ) : st.status === 3 ? (
                                <Badge color="success">Approved</Badge>
                              ) : (
                                <Badge color="danger">Revision</Badge>
                              )} */}
                                    -
                                  </td>
                                  <td>
                                    <span className="badge bg-light-primary text-primary rounded-pill d-inline-block fw-bold">
                                      {st?.task_progress?.toFixed()}%
                                    </span>
                                  </td>
                                  <td>
                                    <div className="members">
                                      <div className="members-item">
                                        {st?.pics?.map(
                                          (pic, i) =>
                                            i < 2 && (
                                              <Fragment key={pic.id}>
                                                <img
                                                  id={`tooltip-${pic.id}`}
                                                  src={user1}
                                                  className="ava-pic rounded-circle"
                                                  alt="avatar"
                                                  width="35"
                                                  height="35"
                                                />
                                                <TooltipHover
                                                  title={pic.first_name}
                                                  id={pic.id?.toString()}
                                                />
                                              </Fragment>
                                            ),
                                        )}
                                        {st?.pics?.length > 2 && (
                                          <div className="member-plus bg-light-info text-info fw-bold">
                                            +{st.pics.length - 2}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  {isDirector && (
                                    <td className="text-center">
                                      {addingFavorite && taskIdSelected === st.task_id ? (
                                        <Spinner size="sm" color="warning" />
                                      ) : (
                                        <abbr title="Mark task" style={{ textDecoration: 'none' }}>
                                          <button
                                            type="button"
                                            className="fav-btn"
                                            onClick={() => handleFavorite(st.task_id)}
                                          >
                                            <MaterialIcon
                                              icon="star"
                                              className={`${st.isFavorite && 'is_favorite'}`}
                                            />
                                          </button>
                                        </abbr>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))}
                          </Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" align="center">
                            Data not found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Col>
              </>
            )}
          </CardBody>
        </Card>
      </Col>
      {modal && <TaskPopup {...{ modal, setModal, toggle, task }} mode="activities" />}
    </>
  );
};

export default ActivityTab;
