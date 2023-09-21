import MaterialIcon from '@material/react-material-icon';
import React, { useState } from 'react';
import { Badge, Button, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import user1 from '../../assets/images/users/user1.jpg';
import user2 from '../../assets/images/users/user2.jpg';
import user3 from '../../assets/images/users/user3.jpg';
import TaskPopup from './TaskPopup';

const BoardTask = ({ data }) => {
  const [modal, setModal] = useState(false);
  const [addSubtaskOpen, setAddSubtaskOpen] = useState(false);
  const [taskId, setTaskId] = useState(undefined);

  const toggle = () => {
    setModal(!modal);
  };

  const openPopup = (selectedId) => {
    setModal(true);
    setTaskId(selectedId);
  };

  return (
    <>
      <div className="">
        {data?.map((td) => (
          <div key={td.task_id} className="board">
            <div className="board-header">
              <div className="">
                <Badge color="info">Daily</Badge>
              </div>
              <MaterialIcon icon="more_horiz" className="board-action" />
            </div>
            <div className="board-body" onClick={() => openPopup(td.task_id)}>
              <div className="task-title">{td.task_title}</div>
              <div className="task-bottom">
                <small className="text-muted">{td.subtasks.length} Subtask</small>
                <div className="task-action">
                  <MaterialIcon icon="done" />
                  <div className="comment">
                    <MaterialIcon icon="comment" />
                    <div>1</div>
                  </div>
                </div>
              </div>
            </div>
            {td.subtasks.length >= 1 &&
              td.subtasks.map((st) => (
                <div key={st.task_id} className="board-body subtask">
                  <div className="task-title">{st.task_title}</div>
                  <div className="task-action">
                    <MaterialIcon icon="done" />
                    <div className="comment">
                      <MaterialIcon icon="comment" />
                      <div>1</div>
                    </div>
                  </div>
                </div>
              ))}
            <div className="board-footer">
              {addSubtaskOpen ? (
                <div className="new-task">
                  <div className="body">
                    <div className="input">
                      <textarea type="text" placeholder="Subtask title here.." />
                    </div>
                    <button type="button">
                      <i className="b bi-person-plus-fill"></i>
                    </button>
                  </div>
                  <div className="footer">
                    <div className="option">
                      <div className="attach">
                        <Label for="attach">
                          <MaterialIcon icon="attach_file" />
                        </Label>
                        <input type="file" id="attach" hidden />
                      </div>
                      <div className="duedate">
                        <Label for="duedate">
                          <MaterialIcon icon="calendar_month" />
                        </Label>
                      </div>
                    </div>
                    <div className="action">
                      <Button
                        type="button"
                        size="sm"
                        color="light"
                        onClick={() => setAddSubtaskOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="button" size="sm">
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {data.status !== 'done' ? (
                    <Button
                      type="button"
                      size="sm"
                      color="light"
                      className="d-flex align-items-center"
                      onClick={() => setAddSubtaskOpen(true)}
                    >
                      <MaterialIcon icon="add" style={{ fontSize: '14px' }} />
                      Add Subtask
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  <div className="member">
                    <img
                      src={user1}
                      className="rounded-circle"
                      alt="avatar"
                      width="35"
                      height="35"
                    />
                    <img
                      src={user2}
                      className="rounded-circle"
                      alt="avatar"
                      width="35"
                      height="35"
                    />
                    <img
                      src={user3}
                      className="rounded-circle"
                      alt="avatar"
                      width="35"
                      height="35"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <TaskPopup {...{ modal, toggle, taskId }} />
    </>
  );
};

BoardTask.propTypes = {
  data: PropTypes.array,
};

export default BoardTask;
