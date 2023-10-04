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

const result = (emId) =>
  emId.filter(
    (person, index) => index === emId.findIndex((other) => person.employe_id === other.employe_id),
  );

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
      .put(`task/${taskId}/status`, {
        employe_id: auth.user.employe_id,
        status: taskStatus,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
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
        icon: <MaterialIcon icon="check" />,
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
              <div className="d-flex" style={{ height: 'max-content' }}>
                <Badge color="info">#{i + 1}</Badge>
              </div>
              {td.status === 0 || td.status === 1 ? (
                updating && taskIdActive === td.task_id ? (
                  <div className="d-flex align-items-center gap-1">
                    <Spinner size="sm" color="success" />
                    <span>
                      Updating status to
                      <strong>
                        {status === 0
                          ? 'To do'
                          : status === 1
                          ? 'In Progress'
                          : status === 3
                          ? 'Done'
                          : ''}
                      </strong>
                    </span>
                  </div>
                ) : (
                  <div key={td.task_id}>
                    <ActionMenu
                      menuOptions={menuOptions}
                      taskId={td.task_id}
                      status={td.status}
                      action={handleTaskStatus}
                    />
                  </div>
                )
              ) : (
                td.status === 2 && (
                  <Badge color="light" className="text-dark">
                    <i className="bi-clock mr-4" style={{ fontSize: '12px' }}></i>
                    &nbsp; Review
                  </Badge>
                )
              )}
            </div>
            <div className="board-body" onClick={() => openPopup(td)}>
              <div className="task-title">{td.task_title}</div>
              <div className="task-bottom">
                <small className="text-muted">{td.subtasks.length} Subtask</small>
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
                  <div className="task-title">{st.task_title}</div>
                  <div className="task-action">
                    <MaterialIcon icon="done" />
                  </div>
                </div>
              ))}
            {td.status !== 3 && (
              <div className="board-footer">
                {addSubtaskOpen === td.task_id ? (
                  <TaskForm
                    {...{ projectId, setAddSubtaskOpen, refetch, type }}
                    taskId={td.task_id}
                  />
                ) : (
                  <>
                    {data.status !== 'done' ? (
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
                    <div className="member">
                      {result(td.pics).map((pic) => (
                        <img
                          key={pic.employe_id}
                          src={user1}
                          className="rounded-circle"
                          alt="avatar"
                          width="35"
                          height="35"
                        />
                      ))}
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
