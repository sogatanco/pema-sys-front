import React from 'react';
import { Button, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import './TaskPopup.scss';
import MaterialIcon from '@material/react-material-icon';
import ActionMenu from '../../components/actionMenu/ActionMenu';
import user1 from '../../assets/images/users/user1.jpg';

const actionMenu = {
  isOpen: false,
};

const handleChange = () => {
  console.log('hello');
};

const TaskPopup = ({ modal, toggle, taskId }) => {
  return (
    <Modal isOpen={modal} toggle={toggle.bind(null)} size="xl" fade={false}>
      <ModalHeader toggle={toggle.bind(null)}>Task Info {taskId}</ModalHeader>
      <ModalBody>
        <div className="popup-body">
          <div className="left">
            <div className="top">
              <div className="created-at">
                <h6>Created at</h6>
                <span>12/10/2023, 08:45</span>
              </div>
              <div className="due-date">
                <h6>Due Date</h6>
                <Input type="date" onChange={handleChange} />
              </div>
            </div>
            <div className="bottom">
              <Input type="text" value="Task title" onChange={handleChange} />
              <Input
                type="textarea"
                name=""
                id=""
                cols="5"
                rows="6"
                value="Task description"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="right">
            <div className="top">
              <div className="status">
                <button type="button" className="btn bg-secondary text-white">
                  To Do
                </button>
                <Button className="btn" outline color="secondary">
                  <MaterialIcon icon="person" />
                </Button>
              </div>
              <ActionMenu data={actionMenu} />
            </div>
            <div className="bottom">
              <div className="history-item">
                <div className="comment-name">
                  <span>Si Fulan</span>
                  <span>Your task approved</span>
                </div>
                <small>Today</small>
              </div>
              <div className="comment-item">
                <div className="comment-user">
                  <img src={user1} className="rounded-circle" alt="avatar" width="35" height="35" />
                  <div className="comment-teks">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea a explicabo fugit
                    consequatur quidem maxime placeat!
                    <div className="comment-time">
                      <small>Mon, 24 Sep 23</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="input-comment">
              <Input type="text" />
              <div className="">
                <Button className="btn" outline color="info">
                  <MaterialIcon icon="send" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      {/* <ModalFooter>
        <Button type="submit" color="info">
          Submit
        </Button>
        <Button color="secondary" outline onClick={toggle.bind(null)}>
          Cancel
        </Button>
      </ModalFooter> */}
    </Modal>
  );
};

TaskPopup.propTypes = {
  modal: PropTypes.bool,
  toggle: PropTypes.any,
  taskId: PropTypes.number,
};

export default TaskPopup;
