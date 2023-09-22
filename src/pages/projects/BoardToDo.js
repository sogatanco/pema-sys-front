import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Label, Spinner } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import { useParams } from 'react-router-dom';
import BoardTask from './BoardTask';
import useAxios from '../../hooks/useAxios';

const BoardToDo = () => {
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);

  const { projectId } = useParams();

  const api = useAxios();

  useEffect(() => {
    async function fetchTodo() {
      await api
        .get(`/task/${projectId}`)
        .then((res) => setData(res.data.tasks))
        .catch((err) => console.log(err));
    }

    fetchTodo();
  }, []);

  const handleChange = (e) => {
    setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const taskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    task.project_id = projectId;
    await api
      .post('/task', task)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setLoading(false);
    setNewTaskOpen(false);
  };

  return (
    <Col lg="4" className="mt-4">
      <h4>To do ({data?.length})</h4>
      <BoardTask data={data} />
      {!newTaskOpen && (
        <Button
          type="button"
          size="sm"
          color="secondary"
          className="d-flex align-items-center justify-content-center"
          block
          onClick={() => setNewTaskOpen(true)}
        >
          <MaterialIcon icon="add" style={{ fontSize: '14px' }} />
          New Task
        </Button>
      )}
      {newTaskOpen && (
        <Form onSubmit={taskSubmit}>
          <div className="new-task">
            <div className="body">
              <div className="input">
                <Input
                  type="textarea"
                  name="task_title"
                  placeholder="Task title here.."
                  onChange={handleChange}
                />
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
                  disabled={loading}
                  onClick={() => setNewTaskOpen(false)}
                >
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
        </Form>
      )}
    </Col>
  );
};

export default BoardToDo;
