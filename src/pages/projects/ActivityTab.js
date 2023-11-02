import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { Badge, Card, CardBody, Col, Spinner, Table } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import useAxios from '../../hooks/useAxios';
import TaskPopup from './TaskPopup';
import user1 from '../../assets/images/users/user1.jpg';
import useAuth from '../../hooks/useAuth';
import { alert } from '../../components/atoms/Toast';
// import TooltipHover from '../../components/atoms/TooltipHover';

const result = (emId) =>
  emId.filter(
    (person, index) => index === emId.findIndex((other) => person.employe_id === other.employe_id),
  );

const ActivityTab = () => {
  const { auth } = useAuth();
  const { projectId } = useParams();
  const [modal, setModal] = useState(false);
  const [task, setTask] = useState(undefined);
  const [taskIdSelected, setTaskIdSelected] = useState();
  const [addingFavorite, setAddingFavorite] = useState();
  const [isDirector, setIsDirector] = useState(false);
  const api = useAxios();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['act'],
    queryFn: () =>
      api.get(`api/task/${projectId}/activities/all${search}`).then((res) => {
        return res.data.data;
      }),
  });

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
      .catch((err) => {
        console.log(err);
        alert('error', 'Bad request.');
      });
    setTaskIdSelected();
    setAddingFavorite(false);
  };

  const favoriteAllowedRoles = ['Director'];

  useEffect(() => {
    if (auth?.user.roles.find((role) => favoriteAllowedRoles.includes(role))) {
      setIsDirector(true);
    }
  }, [auth]);

  return (
    <>
      <Col>
        <Card>
          <CardBody>
            {isLoading ? (
              'loading...'
            ) : error ? (
              'Something went wrong.'
            ) : (
              <Table className="no-wrap mt-3 align-middle" hover>
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
                  {data?.map((ts, idx) => (
                    <>
                      <tr key={ts.task_id}>
                        <td style={{ backgroundColor: '#f9f9f9' }}>{idx + 1}.</td>
                        <td
                          style={{ backgroundColor: '#f9f9f9', cursor: 'pointer' }}
                          onClick={() => openPopup(ts)}
                        >
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
                        <td style={{ backgroundColor: '#f9f9f9' }}>
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
                        <td style={{ backgroundColor: '#f9f9f9' }}>
                          <span className="badge bg-light-success text-primary rounded-pill d-inline-block fw-bold">
                            {ts?.task_progress.toFixed()}%
                          </span>
                        </td>
                        <td style={{ backgroundColor: '#f9f9f9' }}>
                          <div className="member-2">
                            <div className="member-item">
                              {result(ts.pics).map((pic) => (
                                <div key={pic.employe_id}>
                                  <img
                                    // id={`tooltip-${i}`}
                                    // key={pic.employe_id}
                                    src={user1}
                                    className="rounded-circle"
                                    alt="avatar"
                                    width="35"
                                    height="35"
                                  />
                                  {/* <TooltipHover title={pic.first_name} id={i} /> */}
                                </div>
                              ))}
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
                                {st?.task_progress.toFixed()}%
                              </span>
                            </td>
                            <td>
                              {result(st.pics).map((pic) => (
                                <div key={`${pic.employe_id}--${ts.task_id}`}>
                                  <img
                                    // id={`tooltip-${i}`}
                                    src={user1}
                                    className="rounded-circle"
                                    alt="avatar"
                                    width="35"
                                    height="35"
                                  />
                                  {/* <TooltipHover title={pic.first_name} id={i} /> */}
                                </div>
                              ))}
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
                    </>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </Col>
      {modal && <TaskPopup {...{ modal, setModal, toggle, task }} mode="activities" />}
    </>
  );
};

export default ActivityTab;
