import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';

const NewTaskModal = ({ modal, setModal, toggle }) => {
  const [loading, setLoading] = useState();

  const newTaskSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setModal(false);
  };

  return (
    <Modal isOpen={modal} toggle={toggle.bind(null)} size="lg" fade={false}>
      <ModalHeader toggle={toggle.bind(null)}>New Task</ModalHeader>
      <Form onSubmit={newTaskSubmit}>
        <ModalBody>
          <FormGroup>
            <Label htmlFor="task_title">Title</Label>
            <Input
              type="text"
              name="task_title"
              id="task_title"
              placeholder="Task title here"
              //   onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="project_id" className="text-muted">
              Project
            </Label>
            <Input
              type="select"
              id="project_id"
              name="project_id"
              //   disabled={newProject?.base_id !== '3'}
              //   onChange={handleChange}
              defaultValue=""
            >
              <option value="">- Select -</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="employe_id" className="text-muted">
              Assignee
            </Label>
            <Input
              type="select"
              id="employe_id"
              name="employe_id"
              //   disabled={newProject?.base_id !== '3'}
              //   onChange={handleChange}
              defaultValue=""
            >
              <option value="">- Select -</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="task_desc">Description</Label>
            <Input
              type="textarea"
              id="task_area"
              name="task_area"
              placeholder="Explain the goals of the task here"
              rows="3"
              //   onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="task_file">Attachment</Label>
            <Input
              type="file"
              id="task_file"
              name="task_file"
              //   onChange={handleChange}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" color="info" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="me-2" size="sm" color="light" />
                Loading ...
              </>
            ) : (
              'Submit'
            )}
          </Button>
          <Button color="secondary" outline onClick={toggle.bind(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

NewTaskModal.propTypes = {
  modal: PropTypes.bool,
  setModal: PropTypes.func,
  toggle: PropTypes.any,
};

export default NewTaskModal;
