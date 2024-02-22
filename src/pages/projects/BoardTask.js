import MaterialIcon from '@material/react-material-icon';
import React, { Fragment, useState } from 'react';
import { Badge, Spinner } from 'reactstrap';
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
import IndoDate from '../../utils/IndoDate';
import isExpired from '../../utils/isExpired';
import { level1Progress, level2Progress } from '../../utils/countTaskProgress';

// const result = (emId) =>
//   emId.filter(
//     (person, index) => index === emId.findIndex((other) => person.employe_id === other.employe_id),
//   );

const BoardTask = ({ data, projectId, refetch, isMemberActive }) => {
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
          <div key={td.task_id} className="board rounded-3">
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
                    <span style={{ fontSize: '12px' }}>
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
                            {/* {td.task_progress.toFixed(td.task_progress !== 100 && 2)}% */}
                            {level1Progress(td)}%
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
                              key={pic.id}
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
            <div className="board-body task">
              <div className="task-title fw-bold" onClick={() => openPopup(td)}>
                {td.task_title}
              </div>
              <div className="task-bottom">
                <div className="task-info">
                  {/* <small className="text-muted">{td.level_2.length} Subtask</small> */}
                  {isMemberActive && (
                    <button
                      type="button"
                      className="add-child"
                      onClick={() => setAddSubtaskOpen(td.task_id)}
                    >
                      <MaterialIcon icon="add_circle" />
                    </button>
                  )}
                </div>
                <div className="task-action">
                  <div className="comment">
                    <MaterialIcon icon="comment" />
                    <div>{td.comments}</div>
                  </div>
                </div>
              </div>
              {addSubtaskOpen === td.task_id && (
                <div className="p-1">
                  <TaskForm
                    {...{ projectId, setAddSubtaskOpen, refetch, type }}
                    title="Create subtask level 1"
                    taskId={td.task_id}
                  />
                </div>
              )}
            </div>
            {td.level_2?.length > 0 &&
              td.level_2.map((l2) => (
                // <div key={l2.task_id} className="board-body subtask" onClick={() => openPopup(st)}>
                <div key={l2.task_id} className="board-container">
                  <div key={l2.task_id} className="board-body subtask">
                    <div className="task-title" onClick={() => openPopup(l2)}>
                      {l2.task_title}
                    </div>
                    <div className="task-bottom">
                      <div className="task-info">
                        {/* <small className="text-muted">{td.level_2.length} Subtask</small> */}
                        {isMemberActive && (
                          <button
                            type="button"
                            className="add-child"
                            onClick={() => setAddSubtaskOpen(l2.task_id)}
                          >
                            <MaterialIcon icon="add_circle" />
                          </button>
                        )}
                      </div>
                      <div className="task-action">
                        <div className="circular-progress">
                          <CircularPercentage data={level2Progress(l2)} />
                        </div>
                        <div className="comment">
                          <MaterialIcon icon="comment" />
                          <div>{l2.comments}</div>
                        </div>
                      </div>
                    </div>
                    {addSubtaskOpen === l2.task_id && (
                      <div className="p-1">
                        <TaskForm
                          {...{ projectId, setAddSubtaskOpen, refetch, type }}
                          title="Create subtask level 2"
                          taskId={l2.task_id}
                        />
                      </div>
                    )}
                  </div>
                  {l2.level_3?.length > 0 &&
                    l2.level_3.map((l3) => (
                      <div key={l3.task_id} className="board-body subtask-level3">
                        <div className="task-title text-muted" onClick={() => openPopup(l3)}>
                          {l3.task_title}
                        </div>
                        <div className="task-bottom">
                          <div className="task-info"></div>
                          <div className="task-action">
                            <div className="circular-progress">
                              <CircularPercentage data={l3.task_progress} />
                            </div>
                            <div className="comment">
                              <MaterialIcon icon="comment" />
                              <div>{l3.comments}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            {parseInt(td.status, 10) !== 3 && (
              <div className="board-footer">
                <>
                  <div className="d-flex gap-2">
                    <MaterialIcon icon="event" style={{ fontSize: '20px' }} />
                    <span
                      className={`${isExpired(td.end_date) ? 'text-danger' : ''} `}
                      style={{ fontSize: '12px' }}
                    >
                      {IndoDate(td.end_date)}
                    </span>
                  </div>
                  <div className="members">
                    <div className="members-item">
                      {td?.pics?.map(
                        (pic, idx) =>
                          idx < 2 && (
                            <Fragment key={pic.id}>
                              <img
                                id={`tooltip-${pic.id}`}
                                src={user1}
                                className="ava-pic rounded-circle"
                                alt="avatar"
                                width="35"
                                height="35"
                              />
                              <TooltipHover title={pic.first_name} id={pic.id.toString()} />
                            </Fragment>
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
  isMemberActive: PropTypes.bool,
};

export default BoardTask;
