import React, { useEffect, useState } from 'react';
import {
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  InputGroup,
  InputGroupText,
  Spinner,
} from 'reactstrap';
import PropTypes from 'prop-types';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const NewProjectModal = ({ modal, setModal, toggle, refetch }) => {
  const { auth } = useAuth();
  const [newProject, setNewProject] = useState({});
  const [division, setDivision] = useState({});
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);

  const api = useAxios();

  useEffect(() => {
    async function fetchDIvision() {
      await api
        .get(`api/employe/division/${auth?.user.employe_id}`)
        .then((res) => setDivision(res.data.division))
        .catch((err) => console.log(err));
    }

    async function fetchBusinessOptions() {
      await api
        .get(`api/project/business/options`)
        .then((res) => setOptions(res.data))
        .catch((err) => console.log(err));
    }

    fetchBusinessOptions();
    fetchDIvision();
  }, []);

  const handleChange = (e) => {
    setNewProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const newProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    newProject.division = division.organization_id;

    await api
      .post(`api/project`, newProject)
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.log(err);
      });

    setModal(false);
    setLoading(false);
  };

  return (
    <Modal isOpen={modal} toggle={toggle.bind(null)} size="lg" fade={false}>
      <ModalHeader toggle={toggle.bind(null)}>New Project</ModalHeader>
      <Form onSubmit={newProjectSubmit}>
        <ModalBody>
          <FormGroup>
            <Label htmlFor="project_number">Project Number</Label>
            <Input
              type="text"
              name="project_number"
              id="project_number"
              placeholder="Project number here"
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="division">Division</Label>
            <Input
              type="text"
              name="division"
              readOnly
              disabled
              value={division.organization_name}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="project_name">Project name</Label>
            <Input
              type="text"
              name="project_name"
              id="project_name"
              placeholder="Project name here"
              onChange={handleChange}
            />
          </FormGroup>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="start_date">Start date</Label>
                <Input type="date" id="start_date" name="start_date" onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="end_date">End date</Label>
                <Input type="date" id="end_date" name="end_date" onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label htmlFor="goals">Goals</Label>
            <Input
              type="textarea"
              id="goals"
              name="goals"
              placeholder="Explain the goals of the project here"
              rows="3"
              onChange={handleChange}
            />
          </FormGroup>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="estimated_income">Estimated income</Label>
                <InputGroup>
                  <InputGroupText>Rp.</InputGroupText>
                  <Input
                    type="text"
                    id="estimated_income"
                    name="estimated_income"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label htmlFor="estimated_cost">Estimated cost</Label>
                <InputGroup>
                  <InputGroupText>Rp.</InputGroupText>
                  <Input
                    type="text"
                    id="estimated_cost"
                    name="estimated_cost"
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="base_id">Activity base</Label>
                <Input
                  type="select"
                  id="base_id"
                  name="base_id"
                  defaultValue="ab"
                  onChange={handleChange}
                  style={{ textOverflow: 'ellipsis' }}
                >
                  <option disabled value="ab">
                    - Select -
                  </option>
                  {options?.activity_base?.map((ab) => (
                    <option
                      key={ab.base_id}
                      value={ab.base_id}
                      style={{
                        width: '4rem',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {ab.base_description}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="business_id" className="text-muted">
                  Business plan
                </Label>
                <Input
                  type="select"
                  id="business_id"
                  name="business_id"
                  disabled={newProject?.base_id !== '3'}
                  onChange={handleChange}
                  defaultValue=""
                >
                  {newProject?.base_id === '3' && (
                    <>
                      <option value="">- Select -</option>
                      {options?.business_plan?.map((bp) => (
                        <option key={bp.business_id} value={bp.business_id}>
                          {bp.business_desc}
                        </option>
                      ))}
                    </>
                  )}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="level_id">Activity level</Label>
                <Input
                  type="select"
                  id="level_id"
                  name="level_id"
                  defaultValue="al"
                  onChange={handleChange}
                >
                  <option disabled value="al">
                    - Select -
                  </option>
                  {options?.activity_level?.map((al) => (
                    <option key={al.level_id} value={al.level_id}>
                      {al.level_desc}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
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

NewProjectModal.propTypes = {
  modal: PropTypes.bool,
  setModal: PropTypes.func,
  toggle: PropTypes.any,
  refetch: PropTypes.func,
};

export default NewProjectModal;
