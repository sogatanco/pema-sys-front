import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
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

const result = (emId) =>
  emId.filter(
    (person, index) => index === emId.findIndex((other) => person.employe_id === other.employe_id),
  );

const TaskPopup = ({ modal, setModal, toggle, task, refetch }) => {
  const { auth } = useAuth();
  const [history, setHistory] = useState();
  const [loading, setLoading] = useState(false);
  const [taskTemp, setTaskTemp] = useState('');
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [listEmployee, setListEmploye] = useState();
  const [emModal, setEmModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [comments, setComments] = useState();
  const [postComment, setPostComment] = useState();
  const [commentSending, setCommentSending] = useState(false);

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
      start_date: task?.start_date,
      end_date: task?.end_date,
    });

    if (task?.pics) {
      setAssignedEmployees(
        result(task.pics).map((pic) => ({
          label: pic.first_name,
          value: pic.employe_id,
        })),
      );
    }

    async function fetchHistory() {
      await api.get(`/task/history/${task?.task_id}`).then((res) => setHistory(res.data.data));
    }

    async function fetchComments() {
      await api.get(`/comment/${task?.task_id}`).then((res) => setComments(res.data.data));
    }

    fetchComments();
    fetchHistory();
  }, [task]);

  useEffect(() => {
    async function fetchEmployees() {
      await api
        .get(`/employe/assignment-list`)
        .then((res) => setListEmploye(res.data.data))
        .catch((err) => console.log(err));
    }

    fetchEmployees();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    taskTemp.task_pic = assignedEmployees;

    await api.patch(`/task/${task?.task_id}`, taskTemp).then((res) => console.log(res));
    refetch();
    setUpdating(false);
  };

  const deleteTask = async () => {
    setLoading(true);
    await api
      .delete(`task/${task.task_id}`)
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
      .post(`/comment`, postComment)
      .then((res) => setComments((current) => [...current, res.data.data]));
    setCommentSending(false);
    setPostComment();
    e.target.reset();
  };

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
                <Form onSubmit={handleUpdate}>
                  <div className="top">
                    <div className="date">
                      <h6>Start Date</h6>
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
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="pt-2">
                        <Label for="attach">
                          <MaterialIcon icon="attach_file" className="btn-icon" />
                        </Label>
                        <input type="file" id="attach" hidden />
                      </div>
                      <button type="button" className="btn-assigne" onClick={assigneModal}>
                        <i className="bi-person-plus-fill"></i>
                        <span>{assignedEmployees?.length || 0}</span>
                      </button>
                    </div>
                    <Button type="submit" className="btn" outline disabled={updating}>
                      {updating ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
                </Form>
                <div className="attach">
                  <h6>Attachment files</h6>
                  <ul>
                    <li>
                      <Link to="/linkfile">file-almpiran-task-1.pdf</Link>
                    </li>
                    <li>
                      <Link to="/linkfile">file-almpiran-task-1-2.pdf</Link>
                    </li>
                    <li>
                      <Link to="/linkfile">file-almpiran-task-1.pdf</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="right">
                <div className="top">
                  <div className="status">
                    <button type="button" className="btn bg-secondary text-white">
                      To Do
                    </button>
                  </div>
                  <ActionMenu menuOptions={menuOptions} action={deleteTask} />
                </div>
                <div className="bottom">
                  {history && comments ? (
                    <>
                      <div className="history-item">
                        <div className="comment-name">
                          <span>{task && task.created_by} create this task</span>
                        </div>
                        <small>{task && newDate(task.created_at)}</small>
                      </div>
                      {history?.map((h, i) => (
                        <div key={h.approval_id} className="history-item">
                          <div className="comment-name">
                            <span>
                              {h.status === 0 && i > 0
                                ? `${h.first_name} change task to To Do`
                                : h.status === 0
                                ? `${h.first_name} was assigned`
                                : h.status === 1
                                ? `${h.first_name} change task to In Progress`
                                : h.status === 2
                                ? `${h.first_name} change task to Review`
                                : h.status === 3
                                ? `${h.first_name} change task to Done`
                                : `${h.first_name} change task to Revision`}
                            </span>
                          </div>
                          <small>{newDate(h.created_at)}</small>
                        </div>
                      ))}
                      <div className="comment-item">
                        {comments?.map((com) => (
                          <div key={com.comment_id} className="comment-user">
                            <img
                              src={user1}
                              className="rounded-circle"
                              alt="avatar"
                              width="35"
                              height="35"
                            />
                            <div key={com.comment_id} className="comment-teks">
                              <small style={{ fontWeight: '600' }}>{com.first_name}</small>
                              {com.comment}
                              <div className="comment-time">
                                <small>{newDate(com.created_at)}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
};

export default TaskPopup;
