import React, { useEffect, useState } from 'react';
import { Form, Button, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import makeAnimated from 'react-select/animated';
import useAxios from '../../hooks/useAxios';
import { alert } from '../atoms/Toast';
import useAuth from '../../hooks/useAuth';

const EditTab = ({ data, fetchTask }) => {
  const { auth } = useAuth();
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [listEmployee, setListEmploye] = useState();
  const [taskTemp, setTaskTemp] = useState({});
  const [updating, setUpdating] = useState(false);
  const animatedComponents = makeAnimated();

  useEffect(() => {
    setTaskTemp({
      approval_id: data?.approval_id,
      task_title: data?.task_title,
      project_id: data?.project_id,
      task_desc: data?.task_desc,
      task_progress: data?.task_progress,
      start_date: data?.start_date,
      end_date: data?.end_date,
    });

    // setAssignedEmployees([
    //   {
    //     label: task.first_name,
    //     value: task.employe_id,
    //   },
    // ]);
    if (data?.pics) {
      setAssignedEmployees(
        data.pics.map((pic) => ({
          label: pic.first_name,
          value: pic.employe_id,
        })),
      );
    }
  }, [data]);

  const api = useAxios();

  useEffect(() => {
    async function fetchEmployees() {
      await api
        .get(`api/employe/assignment-list?search=all`)
        .then((res) => setListEmploye(res.data.data))
        .catch((err) => console.log(err));
    }

    if (!auth?.user?.roles.includes('Staff')) {
      fetchEmployees();
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    if (assignedEmployees.length !== 0) {
      taskTemp.pic = assignedEmployees;

      await api
        .patch(`api/task/${data?.task_id}`, taskTemp)
        .then(() => {
          alert('success', 'Task has been updated.');
          fetchTask();
        })
        .catch(() => alert('error', 'Something went wrong'));
    } else {
      alert('error', 'Field employee cannot be empty');
    }
    setUpdating(false);
  };

  return (
    <Form onSubmit={handleUpdate}>
      <Col className="edit">
        <Row lg="12">
          <Col lg="6">
            <FormGroup>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                type="date"
                id="start_date"
                name="start_date"
                value={taskTemp?.start_date || ''}
                onChange={(e) => setTaskTemp({ ...taskTemp, start_date: e.target.value })}
              />
            </FormGroup>
          </Col>
          <Col lg="6">
            <FormGroup>
              <Label htmlFor="end_date">Due Date</Label>
              <Input
                type="date"
                id="end_date"
                name="end_date"
                value={taskTemp?.end_date || ''}
                onChange={(e) => setTaskTemp({ ...taskTemp, end_date: e.target.value })}
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label htmlFor="task_title">Task Title</Label>
          <Input
            type="textarea"
            id="task_title"
            name="task_title"
            rows="3"
            value={taskTemp?.task_title || ''}
            onChange={(e) => setTaskTemp({ ...taskTemp, task_title: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="desc">Description</Label>
          <Input
            type="textarea"
            id="desc"
            name="task_desc"
            rows="5"
            value={taskTemp?.task_desc || ''}
            onChange={(e) => setTaskTemp({ ...taskTemp, task_desc: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="assign">Assigne</Label>
          {assignedEmployees.length > 0 && (
            <Select
              closeMenuOnSelect
              components={animatedComponents}
              isMulti
              defaultValue={assignedEmployees}
              options={listEmployee}
              onChange={(choice) => setAssignedEmployees(choice)}
            />
          )}
          {assignedEmployees.length === 0 && (
            <Select
              closeMenuOnSelect
              components={animatedComponents}
              isMulti
              options={listEmployee}
              onChange={(choice) => setAssignedEmployees(choice)}
            />
          )}
        </FormGroup>
        <Row>
          <Col className="d-flex gap-3 justify-content-end">
            <Button
              type="submit"
              className="btn"
              color="info"
              disabled={updating || data?.status === 3}
              size="sm"
            >
              {updating ? 'Updating...' : 'Update'}
            </Button>
          </Col>
        </Row>
        <br />
      </Col>
    </Form>
  );
};

EditTab.propTypes = {
  data: PropTypes.object,
  fetchTask: PropTypes.func,
};

export default EditTab;
