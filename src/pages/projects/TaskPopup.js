import React, { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import PropTypes from 'prop-types';
import './TaskPopup.scss';
import MaterialIcon from '@material/react-material-icon';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Link } from 'react-router-dom';
import ActionMenu from '../../components/actionMenu/ActionMenu';
import user1 from '../../assets/images/users/user1.jpg';
import useAxios from '../../hooks/useAxios';
import newDate from '../../utils/formatDate';
import useAuth from '../../hooks/useAuth';
import TooltipHover from '../../components/atoms/TooltipHover';
import { alert } from '../../components/atoms/Toast';

// const result = (emId) =>
//   emId.filter(
//     (person, index) => index === emId.findIndex((other) => person.employe_id === other.employe_id),
//   );

// const sortByDate = (data) => data.sort(({ date: a }, { date: b }) => (a < b ? -1 : a > b ? 1 : 0));

const TaskPopup = ({ modal, setModal, toggle, task, refetch, mode }) => {
  const { auth } = useAuth();
  const [history, setHistory] = useState();
  const [loading, setLoading] = useState(false);
  const [taskTemp, setTaskTemp] = useState('');
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [listEmployee, setListEmploye] = useState();
  const [emModal, setEmModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [comments, setComments] = useState();
  const [postComment, setPostComment] = useState();
  const [commentSending, setCommentSending] = useState(false);
  const [files, setFiles] = useState([]);
  const [popContent, setPopContent] = useState();

  const inputCommentRef = useRef();

  const api = useAxios();

  const animatedComponents = makeAnimated();

  const assigneModal = () => {
    setEmModal(true);
  };

  useEffect(() => {
    setTaskTemp({
      task_title: task?.task_title,
      task_desc: task?.task_desc,
      task_progress: task?.task_progress,
      start_date: task?.start_date,
      end_date: task?.end_date,
    });

    setAssignedEmployees([
      {
        label: task.first_name,
        value: task.employe_id,
      },
    ]);
    // if (task?.pics) {
    //   setAssignedEmployees(
    //     result(task.pics).map((pic) => ({
    //       label: pic.first_name,
    //       value: pic.employe_id,
    //     })),
    //   );
    // }

    async function fetchHistory() {
      await api.get(`api/task/history/${task?.task_id}/${task?.employe_id}`).then((res) => {
        setHistory(res.data.data);
      });
    }

    async function fetchComments() {
      await api.get(`api/comment/${task?.task_id}`).then((res) => setComments(res.data.data));
    }

    fetchComments();
    fetchHistory();
  }, [task]);

  useEffect(() => {
    async function fetchEmployees() {
      await api
        .get(`api/employe/assignment-list`)
        .then((res) => setListEmploye(res.data.data))
        .catch((err) => console.log(err));
    }

    fetchEmployees();
  }, []);

  useEffect(() => {
    setPopContent(history?.concat(comments));
  }, [history, comments]);

  useEffect(() => {
    popContent?.sort((a, b) => a.created_at.localeCompare(b.created_at));
  }, [popContent]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    taskTemp.task_pic = assignedEmployees;

    if (files) {
      taskTemp.files = files;
    }
    await api.patch(`api/task/${task?.task_id}`, taskTemp).then(() => {
      alert('success', 'Task has been updated.');
    });
    setModal(false);
    refetch();
    setUpdating(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);
    await api
      .post(`api/task/${task.task_id}/upload`, files, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => task.files.push(res.data.file));
    setFiles([]);
    setUploading(false);
  };

  const deleteTask = async () => {
    setLoading(true);
    await api
      .delete(`api/task/${task.task_id}`)
      .then()
      .catch((err) => console.log(err));
    setLoading(false);
    setModal(false);
    refetch();
  };

  const menuOptions = {
    taskId: task?.task_id,
    options: [
      {
        id: 1,
        type: 'delete',
        to: 'toDelete',
      },
    ],
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setCommentSending(true);
    postComment.employe_id = auth.user.employe_id;
    postComment.task_id = task.task_id;
    await api
      .post(`api/comment`, postComment)
      .then((res) => setPopContent((current) => [...current, res.data.data]));
    setCommentSending(false);
    setPostComment();
    e.target.reset();
  };

  const fileUrl = process.env.REACT_APP_FILEURL;

  return (
    <>
      <Modal isOpen={modal} toggle={toggle.bind(null)} size="xl" fade={false}>
        <ModalHeader toggle={toggle.bind(null)}>Task Info</ModalHeader>
        <ModalBody>
          {loading ? (
            <div className="d-flex justify-content-center" style={{ height: '400px' }}>
              Loading..
            </div>
          ) : (
            <div className="popup-body">
              <div className="left">
                {auth?.user.employe_id !== task.employe_id || mode === 'activities' ? (
                  <>
                    <>
                      <div className="top">
                        <div className="date">
                          <h6>Start Date</h6>
                          <span>{taskTemp?.start_date || '-'}</span>
                        </div>
                        <div className="date">
                          <h6>Due Date</h6>
                          <span>{taskTemp?.end_date || ''}</span>
                        </div>
                      </div>
                      <div className="bottom mt-3">
                        <FormGroup>
                          <Label>Task Title</Label>
                          <Input type="text" value={taskTemp?.task_title || ''} readOnly disabled />
                        </FormGroup>
                        <FormGroup>
                          <Label>Description</Label>
                          <Input
                            type="textarea"
                            value={taskTemp?.task_desc || ''}
                            readOnly
                            disabled
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label>PIC</Label>
                          <br></br>
                          <div className="d-flex flex-column">
                            {assignedEmployees.map((em, i) => (
                              <div key={em.value} className="d-flex gap-3">
                                <span>{i + 1}.</span>
                                <span>{em.label}</span>
                              </div>
                            ))}
                          </div>
                        </FormGroup>
                      </div>
                      <div className="attach">
                        <h6>Attachment files ({task?.files?.length || 0})</h6>
                        <ul>
                          {task?.files?.length > 0 &&
                            task?.files.map((f) => (
                              <div key={f.file_id} className="d-flex gap-1 align-items-center">
                                <li>
                                  <Link
                                    className="file-link"
                                    to={`${fileUrl}taskfiles/${f.file_name}`}
                                    target="_blank"
                                  >
                                    {f.file_name}
                                  </Link>
                                </li>
                                <button
                                  type="button"
                                  className="btn d-flex"
                                  style={{ color: '#EF6767' }}
                                >
                                  <MaterialIcon
                                    icon="delete_outline"
                                    style={{ fontSize: '20px' }}
                                  />
                                </button>
                              </div>
                            ))}
                        </ul>
                      </div>
                    </>
                  </>
                ) : (
                  <>
                    <form onSubmit={handleUpdate}>
                      <div className="top">
                        <div className="date">
                          <h6>Start Date {task.subtasks?.length}</h6>
                          <span>{taskTemp?.start_date || '-'}</span>
                        </div>
                        <div className="date">
                          <h6>Due Date</h6>
                          <Input
                            type="date"
                            name="end_date"
                            value={taskTemp?.end_date || ''}
                            onChange={(e) => setTaskTemp({ ...taskTemp, end_date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="bottom mt-3">
                        <Input
                          type="text"
                          name="task_title"
                          value={taskTemp?.task_title || ''}
                          onChange={(e) => setTaskTemp({ ...taskTemp, task_title: e.target.value })}
                        />
                        <Input
                          type="textarea"
                          cols="5"
                          rows="6"
                          name="task_desc"
                          value={taskTemp?.task_desc || ''}
                          onChange={(e) => setTaskTemp({ ...taskTemp, task_desc: e.target.value })}
                        />
                        {task?.subtasks?.length > 0 ? (
                          ''
                        ) : (
                          <div className="d-flex gap-2 justify-content-between">
                            <div className="col-sm-10">
                              <Input
                                type="range"
                                defaultValue={task.task_progress}
                                onChange={(e) =>
                                  setTaskTemp({ ...taskTemp, task_progress: e.target.value })
                                }
                              />
                            </div>
                            <div className="col-sm-1 d-flex justify-content-end">
                              {taskTemp?.task_progress}%
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div className="d-flex align-items-center gap-3">
                          <button type="button" className="btn-assigne" onClick={assigneModal}>
                            <i className="bi-person-plus-fill"></i>
                            <span>{assignedEmployees?.length || 0}</span>
                          </button>
                        </div>
                        <Button
                          type="submit"
                          className="btn"
                          color="info"
                          disabled={updating}
                          size="sm"
                        >
                          {updating ? 'Updating...' : 'Update'}
                        </Button>
                      </div>
                    </form>
                    <form onSubmit={handleUpload}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-1">
                          <div className="pt-2" id="tooltip-3">
                            <Label for="attach">
                              <MaterialIcon icon="attach_file" className="btn-icon" />
                            </Label>
                            <input
                              type="file"
                              id="attach"
                              hidden
                              onChange={(e) => setFiles(e.target.files)}
                              required
                            />
                            <TooltipHover title="Upload file" id="3" />
                          </div>
                          <span style={{ color: '#1F88E5', fontSize: '12px' }}>
                            {files[0]?.name}
                          </span>
                        </div>
                        <Button type="submit" className="btn" outline size="sm">
                          {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                      </div>
                    </form>
                    <div className="attach">
                      <h6>Attachment files ({task?.files?.length || 0})</h6>
                      <ul>
                        {task?.files?.length > 0 &&
                          task?.files.map((f) => (
                            <div key={f.file_id} className="d-flex gap-1 align-items-center">
                              <li>
                                <Link
                                  className="file-link"
                                  to={`${fileUrl}taskfiles/${f.file_name}`}
                                  target="_blank"
                                >
                                  {f.file_name}
                                </Link>
                              </li>
                              <button
                                type="button"
                                className="btn d-flex"
                                style={{ color: '#EF6767' }}
                              >
                                <MaterialIcon icon="delete_outline" style={{ fontSize: '20px' }} />
                              </button>
                            </div>
                          ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
              <div className="right">
                <div className="top">
                  {task.task_parent === null ? (
                    <div className="status">
                      <span className="badge bg-light-success text-primary rounded-pill d-inline-block fw-bold">
                        Task
                      </span>
                      {task?.status === 0 ? (
                        <Badge color="info">To Do</Badge>
                      ) : task?.status === 1 ? (
                        <Badge color="primary">In Progress</Badge>
                      ) : task?.status === 2 ? (
                        <Badge color="light" className="text-dark">
                          <i className="bi-clock mr-4" style={{ fontSize: '12px' }}></i>
                          &nbsp; Waiting for approval: <strong></strong>
                        </Badge>
                      ) : task?.status === 3 ? (
                        <Badge color="success" className="d-flex">
                          {' '}
                          <i className="bi-check2-circle mr-4" style={{ fontSize: '13px' }}></i>
                          &nbsp; Approved
                        </Badge>
                      ) : (
                        <Badge color="danger">Revision</Badge>
                      )}
                    </div>
                  ) : (
                    <div className="status">
                      <span className="badge bg-light-success text-primary rounded-pill d-inline-block fw-bold">
                        Subtask
                      </span>
                    </div>
                  )}
                  {auth?.user.employe_id === task.employe_id && (
                    <ActionMenu menuOptions={menuOptions} action={deleteTask} />
                  )}
                </div>
                <div className="bottom">
                  {history && comments ? (
                    <>
                      <div className="history-item">
                        <div className="comment-name">
                          <span>
                            <strong>{task && task.created_by}</strong> create this task
                          </span>
                        </div>
                        <small>{task && newDate(task.created_at)}</small>
                      </div>
                      {popContent?.map((h, i) => (
                        <div key={h.created_at}>
                          {h.approval_id ? (
                            <>
                              <div className="history-item">
                                <div className="comment-name">
                                  {h.status === 0 && i > 0 ? (
                                    <span>
                                      <strong>{h.pic_task}</strong> change task to To Do
                                    </span>
                                  ) : h.status === 0 ? (
                                    <span>
                                      <strong>{h.pic_task}</strong> was assigned
                                    </span>
                                  ) : h.status === 1 ? (
                                    <span>
                                      <strong>{h.pic_task}</strong> change task to In Progress
                                    </span>
                                  ) : h.status === 2 ? (
                                    <span>
                                      <strong>{h.pic_task}</strong> change task to Review
                                    </span>
                                  ) : h.status === 3 ? (
                                    <span>
                                      <strong>{h.status_by} </strong> task approved
                                    </span>
                                  ) : (
                                    <>
                                      <span>
                                        <strong>{h.status_by} </strong>change task to Revision
                                      </span>
                                    </>
                                  )}
                                </div>
                                <small>{newDate(h.created_at)}</small>
                              </div>
                              {(h.status === 3 || h.status === 4) && (
                                <div className="comment-item mt-1">
                                  <div className="comment-user ">
                                    <div
                                      className={`comment-teks ${
                                        h.status === 3 ? 'text-success' : 'text-warning'
                                      }`}
                                    >
                                      <small style={{ fontWeight: '600' }}>
                                        {h.status === 3 ? 'Comment' : 'Notes'}
                                      </small>
                                      {h.notes}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="comment-item">
                              <div key={h.comment_id} className="comment-user">
                                <img
                                  src={user1}
                                  className="rounded-circle"
                                  alt="avatar"
                                  width="35"
                                  height="35"
                                />
                                <div key={h.comment_id} className="comment-teks">
                                  <small style={{ fontWeight: '600' }}>{h.first_name}</small>
                                  {h.comment}
                                  <div className="comment-time">
                                    <small>{newDate(h.created_at)}</small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    'Loading...'
                  )}
                </div>
                <Form onSubmit={handleComment}>
                  <div className="input-comment">
                    <Input
                      type="text"
                      name="comment"
                      ref={inputCommentRef}
                      onChange={(e) => setPostComment({ comment: e.target.value })}
                      autoComplete="off"
                    />
                    <div className="">
                      <Button
                        className="btn"
                        outline
                        color="info"
                        disabled={commentSending}
                        type="submit"
                      >
                        <MaterialIcon icon="send" />
                        {commentSending ? 'Sending' : 'Send'}
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
      <Modal isOpen={emModal} size="md" fade={false} centered>
        <ModalHeader toggle={() => setEmModal(false)}>Assigne Employee</ModalHeader>
        <ModalBody>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            defaultValue={assignedEmployees}
            options={listEmployee}
            onChange={(choice) => setAssignedEmployees(choice)}
            isDisabled
          />
        </ModalBody>
      </Modal>
    </>
  );
};

TaskPopup.propTypes = {
  modal: PropTypes.bool,
  setModal: PropTypes.func,
  toggle: PropTypes.any,
  task: PropTypes.any,
  refetch: PropTypes.func,
  mode: PropTypes.string,
};

export default TaskPopup;
