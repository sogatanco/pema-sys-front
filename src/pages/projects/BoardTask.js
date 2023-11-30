import MaterialIcon from '@material/react-material-icon';
import React, { useState } from 'react';
import { Badge, Button, Spinner } from 'reactstrap';
import PropTypes from 'prop-types';
import user1 from '../../assets/images/users/user1.jpg';
import TaskPopup from './TaskPopup';
import TaskForm from './TaskForm';
import ActionMenu from '../../components/actionMenu/ActionMenu';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import { alert } from '../../components/atoms/Toast';
import CircularPercentage from '../../components/atoms/circularPercentage/CircularPercentage';
import TooltipHover from '../../components/atoms/TooltipHover';

// const result = (emId) =>
//   emId.filter(
//     (person, index) => index === emId.findIndex((other) => person.employe_id === other.employe_id),
//   );

const BoardTask = ({ data, projectId, refetch }) => {
  const { auth } = useAuth();
  const [modal, setModal] = useState(false);
  const [addSubtaskOpen, setAddSubtaskOpen] = useState(undefined);
  const [task, setTask] = useState(undefined);
  const [updating, setUpdating] = useState();
  const [taskIdActive, setTaskIdActive] = useState();
  const [status, setStatus] = useState();

  const api = useAxios();

  const toggle = () => {
    setModal(!modal);
  };

  const openPopup = (selectedTask) => {
    setModal(true);
    setTask(selectedTask);
  };

  const type = 2;

  const handleTaskStatus = async (taskId, taskStatus) => {
    setTaskIdActive(taskId);
    setStatus(taskStatus);
    setUpdating(true);
    await api
      .put(`api/task/${taskId}/status`, {
        employe_id: auth.user.employe_id,
        status: taskStatus,
      })
      .then(() => {
        alert(
          taskStatus === 1 ? 'start' : taskStatus === 2 ? 'done' : 'success',
          `Task status has been changed to ${
            taskStatus === 0 ? 'To Do' : taskStatus === 1 ? 'In Progress' : 'Done'
          }`,
        );
      })
      .catch((err) => {
        alert('error', err.response.data.error);
      });
    refetch();
    setUpdating(false);
    setTaskIdActive();
    setStatus();
  };

  const menuOptions = {
    options: [
      {
        id: 1,
        icon: <MaterialIcon icon="edit_note" />,
        type: 'button',
        label: 'To do',
        to: 0,
      },
      {
        id: 2,
        icon: <MaterialIcon icon="play_circle_outline" />,
        type: 'button',
        label: 'In Progress',
        to: 1,
      },
      {
        id: 3,
        icon: <MaterialIcon icon="task_alt" />,
        type: 'button',
        label: 'Done',
        to: 2,
      },
    ],
  };

  return (
    <>
      <div className="">
        {data?.map((td, i) => (
          <div key={td.task_id} className="board">
            <div className="board-header">
              <div className="d-flex gap-2" style={{ height: 'max-content' }}>
                <Badge
                  color="info"
                  className={`bg-light-${
                    td.status === 0 ? 'primary' : td.status === 1 ? 'warning' : 'success'
                  } text-${
                    td.status === 0 ? 'primary' : td.status === 1 ? 'warning' : 'success'
                  } fw-bold`}
                >
                  #{i + 1}
                </Badge>
                {parseInt(td.status, 10) === 4 && (
                  <Badge color="danger">
                    <i className="bi-pencil-square mr-4" style={{ fontSize: '12px' }}></i>
                    &nbsp; Revision
                  </Badge>
                )}
              </div>
              {parseInt(td.status, 10) === 0 ||
              parseInt(td.status, 10) === 1 ||
              parseInt(td.status, 10) === 4 ? (
                updating && taskIdActive === td.task_id ? (
                  <div className="d-flex align-items-center gap-1">
                    <Spinner size="sm" color="success" />
                    <span>
                      Updating status to{' '}
                      <strong>
                        {status === 0
                          ? 'To do'
                          : status === 1
                          ? 'In Progress'
                          : status === 2
                          ? 'Done'
                          : ''}
                      </strong>
                    </span>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <div className="">
                      {parseInt(td.status, 10) === 1 && (
                        <span style={{ fontSize: '12px' }}>
                          Progress{'  '}
                          <strong
                            style={{
                              fontSize: '14px',
                              color: td.task_progress === 100 ? '#4cc790' : '#21C1D6',
                            }}
                          >
                            {td.task_progress.toFixed(td.task_progress !== 100 && 2)}%
                          </strong>
                        </span>
                        // <div className="progress-bar">
                        //   <Progress
                        //     className="mb-0"
                        //     value={td.task_progress}
                        //     color="success"
                        //     style={{ fontSize: '10px', height: '12px' }}
                        //   />
                        //   <div className={`num ${td.task_progress > 52 && 'white'}`}>
                        //     {td.task_progress}%
                        //   </div>
                        // </div>
                      )}
                    </div>
                    <div key={td.task_id}>
                      {td.pics.map(
                        (pic) =>
                          pic.employe_id.toString() === auth?.user.employe_id && (
                            <ActionMenu
                              key={td.task_id}
                              menuOptions={menuOptions}
                              taskId={td.task_id}
                              status={parseInt(td.status, 10)}
                              action={handleTaskStatus}
                              progress={td.task_progress}
                            />
                          ),
                      )}
                    </div>
                  </div>
                )
              ) : parseInt(td.status, 10) === 2 ? (
                <Badge color="light" className="d-flex text-dark">
                  <i className="bi-clock mr-4" style={{ fontSize: '12px' }}></i>
                  &nbsp; Waiting for approval
                </Badge>
              ) : parseInt(td.status, 10) === 3 ? (
                <Badge color="success" className="d-flex">
                  <i className="bi-check2-circle mr-4" style={{ fontSize: '13px' }}></i>
                  &nbsp; Approved
                </Badge>
              ) : (
                ''
              )}
            </div>
            <div className="board-body" onClick={() => openPopup(td)}>
              <div className="task-title fw-bold">{td.task_title}</div>
              <div className="task-bottom">
                <div className="task-info">
                  <small className="text-muted">{td.subtasks.length} Subtask</small>
                </div>
                <div className="task-action">
                  <div className="comment">
                    <MaterialIcon icon="comment" />
                    <div>{td.comments}</div>
                  </div>
                </div>
              </div>
            </div>
            {td.subtasks.length >= 1 &&
              td.subtasks.map((st) => (
                <div key={st.task_id} className="board-body subtask" onClick={() => openPopup(st)}>
                  <div className="task-title text-muted">{st.task_title}</div>
                  <div className="task-action">
                    <div className="circular-progress">
                      <CircularPercentage data={st.task_progress} />
                      {/* <Progress
                          className="mb-0"
                          value={st.task_progress}
                          color="success"
                          style={{ fontSize: '10px', height: '12px' }}
                          />
                          <div className={`num ${st.task_progress > 52 && 'white'}`}>
                          {st.task_progress}%
                        </div> */}
                    </div>
                    <div className="comment">
                      <MaterialIcon icon="comment" />
                      <div>{st.comments}</div>
                    </div>
                  </div>
                </div>
              ))}
            {parseInt(td.status, 10) !== 3 && (
              <div className="board-footer">
                {addSubtaskOpen === td.task_id ? (
                  <TaskForm
                    {...{ projectId, setAddSubtaskOpen, refetch, type }}
                    taskId={td.task_id}
                  />
                ) : (
                  <>
                    {td.status !== 2 ? (
                      <Button
                        type="button"
                        size="sm"
                        color="light"
                        className="d-flex align-items-center"
                        onClick={() => setAddSubtaskOpen(td.task_id)}
                      >
                        <MaterialIcon icon="add" style={{ fontSize: '14px' }} />
                        Add Subtask
                      </Button>
                    ) : (
                      <div></div>
                    )}
                    <div className="member-2">
                      <div className="member-item">
                        {td?.pics?.map(
                          (pic, idx) =>
                            idx < 2 && (
                              <div key={pic.id} className="ava-img">
                                <img
                                  id={`tooltip-${pic.id}`}
                                  src={user1}
                                  className="rounded-circle"
                                  alt="avatar"
                                  width="35"
                                  height="35"
                                />
                                <TooltipHover title={pic.first_name} id={pic.id.toString()} />
                              </div>
                            ),
                        )}
                        {td?.pics?.length > 2 && (
                          <div className="member-plus bg-light-info text-info fw-bold">
                            +{td.pics.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {modal && <TaskPopup {...{ modal, setModal, toggle, task, refetch }} />}
    </>
  );
};

BoardTask.propTypes = {
  data: PropTypes.array,
  projectId: PropTypes.string,
  refetch: PropTypes.func,
  isRefetching: PropTypes.any,
};

export default BoardTask;
