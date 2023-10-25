import MaterialIcon from '@material/react-material-icon';
import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalHeader, Spinner } from 'reactstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import './TaskForm.scss';
import { alert } from '../../components/atoms/Toast';
import TooltipHover from '../../components/atoms/TooltipHover';

const TaskForm = (props) => {
  const { auth } = useAuth();
  const { projectId, setNewTaskOpen, setAddSubtaskOpen, refetch, type, taskId } = props;
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({});
  const [modal, setModal] = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [listEmployee, setListEmploye] = useState();
  // const [files, setFiles] = useState([]);

  const animatedComponents = makeAnimated();

  const toggle = () => {
    setModal(!modal);
  };

  const api = useAxios();

  useEffect(() => {
    async function fetchEmployees() {
      await api
        .get(`api/employe/assignment-list`)
        .then((res) => {
          setListEmploye(res.data.data);
        })
        .catch((err) => console.log(err));
    }

    fetchEmployees();

    setAssignedEmployees([
      {
        value: auth.user.employe_id,
        label: auth.user.first_name,
        isFixed: false,
      },
    ]);
  }, []);

  const handleChange = (e) => {
    setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const assigneModal = () => {
    setModal(true);
  };

  const closeForm = () => {
    if (type === 1) {
      setNewTaskOpen(false);
    } else {
      setAddSubtaskOpen(undefined);
    }
  };

  const taskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    task.project_id = projectId;
    task.task_pic = assignedEmployees;
    // eslint-disable-next-line prefer-destructuring
    // task.files = files;

    if (type === 2) {
      task.task_parent = taskId;
    }

    await api
      .post('api/task', task, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        alert('create', 'New task has been created.');
      })
      .catch((err) => console.log(err.message));
    setLoading(false);
    refetch();
    closeForm();
  };

  return (
    <>
      <div className="task-form-overlay" onClick={closeForm} />
      <form onSubmit={taskSubmit} style={{ width: '100%' }} encType="multipart/form-data">
        <div className="new-task">
          <div className="body">
            <div className="input">
              <Input
                type="textarea"
                name="task_title"
                placeholder="Task title here.."
                required
                onChange={handleChange}
              />
            </div>
            <button type="button" className="btn-assigne" id="tooltip-2" onClick={assigneModal}>
              <i className="bi-person-plus-fill"></i>
              <span>{assignedEmployees?.length || 0}</span>
            </button>
            <TooltipHover title="Assigne" id={2} />
          </div>
          <div className="footer">
            <div className="option">
              {/* <div className="attach">
                <Label for="attach">
                  <MaterialIcon icon="attach_file" className="btn-icon" />
                </Label>
                <input type="file" id="attach" hidden onChange={(e) => setFiles(e.target.files)} />
              </div> */}
              <div className="duedate">
                <span className="datepicker-toggle" id="tooltip-1">
                  <span className="datepicker-toggle-button">
                    <MaterialIcon icon="calendar_month" />
                  </span>
                  <input
                    type="date"
                    name="end_date"
                    className="datepicker-input"
                    required
                    onChange={handleChange}
                  />
                </span>
                <TooltipHover title="Due date" id="1" />
                <span>{task.end_date}</span>
              </div>
            </div>
            <div className="action">
              <Button type="button" size="sm" color="light" disabled={loading} onClick={closeForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="d-flex gap-2 align-items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Loading...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
      <Modal isOpen={modal} toggle={toggle.bind(null)} size="md" fade={false} centered>
        <ModalHeader toggle={toggle.bind(null)}>Assigne Employee</ModalHeader>
        <ModalBody>
          <Select
            // closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            defaultValue={assignedEmployees}
            options={listEmployee}
            isClearable={assignedEmployees.some((v) => !v.isFixed)}
            onChange={(choice) => setAssignedEmployees(choice)}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

TaskForm.propTypes = {
  projectId: PropTypes.string,
  setNewTaskOpen: PropTypes.func,
  setAddSubtaskOpen: PropTypes.any,
  refetch: PropTypes.func,
  type: PropTypes.number,
  taskId: PropTypes.number,
};

export default TaskForm;
