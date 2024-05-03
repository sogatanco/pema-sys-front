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
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import { alert } from '../../components/atoms/Toast';

const NewProjectModal = ({ modal, setModal, toggle, refetch }) => {
  const { auth } = useAuth();
  const [newProject, setNewProject] = useState({});
  const [division, setDivision] = useState({});
  const [options, setOptions] = useState({});
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [partner, setPartner] = useState({});
  const [loading, setLoading] = useState(false);
  const [otherPartner, setOtherPartner] = useState(false);
  const [anotherBaseId, setAnotherBaseId] = useState(false);
  const [isSavingBaseId, setIsSavingBaseId] = useState(false);
  const [newBaseId, setNewBaseId] = useState();
  const [businessPlan, setBusinessPlan] = useState({});
  const animatedComponents = makeAnimated();

  const api = useAxios();

  const fetchBusinessOptions = async () => {
    await api
      .get(`api/project/business/options`)
      .then((res) => setOptions(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    async function fetchDIvision() {
      await api
        .get(`api/employe/division/${auth?.user.employe_id}`)
        .then((res) => setDivision(res.data.division))
        .catch((err) => console.log(err));
    }

    async function fetchPartnerOptions() {
      await api
        .get(`api/list-mitra`)
        .then((res) => {
          setPartnerOptions(res.data.data);
        })
        .catch((err) => console.log(err));
    }

    fetchBusinessOptions();
    fetchDIvision();
    fetchPartnerOptions();
  }, []);

  useEffect(() => {
    partnerOptions.unshift({ label: 'TAMBAH LAINNYA', value: 'LAINNYA' });
  }, [partnerOptions]);

  const handleChange = (e) => {
    setNewProject((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (partner?.value === 'LAINNYA') {
      setOtherPartner(true);
      setPartner({});
    }
  }, [partner]);

  useEffect(() => {
    if (newProject?.base_id === 'another') {
      setAnotherBaseId(true);
    }
  }, [newProject]);

  const newProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    newProject.division = division?.organization_id;
    newProject.partner = otherPartner ? newProject.partner : partner?.value;
    newProject.business_id = businessPlan?.value;

    if (newProject.base_id === '3' && newProject.business_id === undefined) {
      alert('error', 'Field Business Plan cannot be empty');
    } else if (newProject.base_id === undefined) {
      alert('error', 'Field Activity Base cannot be empty');
    } else {
      await api
        .post(`api/project`, newProject)
        .then(() => {
          alert('success', 'Project has been created.');
          refetch();
        })
        .catch(() => {
          alert('error', 'Something went wrong.');
        });

      setModal(false);
    }
    setOtherPartner(false);
    setLoading(false);
  };

  const submitBaseId = async () => {
    setIsSavingBaseId(true);
    if (newBaseId) {
      await api
        .post('api/project/activity-base/add', { activity_name: newBaseId })
        .then((res) => {
          fetchBusinessOptions();
          alert('success', res.data.message);
        })
        .catch(() => {
          alert('error', 'Something went wrong');
        });
    } else {
      alert('error', 'Field cannot be empty');
    }
    setNewBaseId();
    setAnotherBaseId(false);
    setIsSavingBaseId(false);
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
              required
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
              required
            />
          </FormGroup>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="start_date">Start date</Label>
                <Input
                  type="date"
                  id="start_date"
                  name="start_date"
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="end_date">End date</Label>
                <Input type="date" id="end_date" name="end_date" onChange={handleChange} required />
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
              required
            />
          </FormGroup>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="level_id">Activity level</Label>
                <Input
                  type="select"
                  id="level_id"
                  name="level_id"
                  defaultValue=""
                  onChange={handleChange}
                  required
                >
                  <option disabled value="">
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
            <Col md="6">
              <FormGroup>
                <Label for="category">Category</Label>
                <Input
                  type="select"
                  id="category"
                  name="category"
                  defaultValue=""
                  onChange={handleChange}
                  required
                >
                  <option disabled value="">
                    - Select -
                  </option>
                  <option value="business">Business</option>
                  <option value="non-business">Non-business</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          {newProject?.category === 'business' && (
            <>
              {/* <FormGroup>
                <Label for="partner">Partner</Label>
                <Input
                  type="select"
                  id="partner"
                  name="partner"
                  defaultValue="pa"
                  onChange={handleChange}
                >
                  <option disabled value="pa">
                    - Select -
                  </option>
                  {partnerOptions.length > 0 &&
                    partnerOptions.map((p) => (
                      <option key={p.id_user} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                </Input>
              </FormGroup> */}
              <FormGroup>
                <Label for="partner">{otherPartner ? 'Add Other Partner' : 'Partner'}</Label>
                {otherPartner ? (
                  <Input
                    type="text"
                    name="partner"
                    id="partner"
                    placeholder="Type here.."
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <Select
                    components={animatedComponents}
                    options={partnerOptions}
                    onChange={(choice) => setPartner(choice)}
                  />
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="desc">Description for Initiation & Definition phase</Label>
                <Input
                  type="textarea"
                  id="desc"
                  name="desc"
                  placeholder="Description of the phase here"
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
                        type="number"
                        min="1"
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
                        type="number"
                        min="1"
                        id="estimated_cost"
                        name="estimated_cost"
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}
          {anotherBaseId ? (
            <Row>
              <Col md="12">
                <FormGroup>
                  <Label for="activity_name">Add Activity Base</Label>
                  <div className="d-flex gap-3">
                    <div style={{ width: '70%' }}>
                      <Input
                        type="text"
                        name="activity_name"
                        id="activity_name"
                        placeholder="Type here.."
                        onChange={(e) => setNewBaseId(e.target.value)}
                      />
                    </div>
                    <Button
                      className="d-flex align-items-center"
                      type="button"
                      color="success"
                      size="sm"
                      onClick={submitBaseId}
                      disabled={isSavingBaseId}
                    >
                      {isSavingBaseId ? (
                        <>
                          <Spinner className="me-2" size="sm" color="light" />
                          Loading
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                    <Button
                      type="button"
                      outline
                      onClick={() => setAnotherBaseId(false)}
                      disabled={isSavingBaseId}
                    >
                      Cancel
                    </Button>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          ) : (
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
                    <option value="another">Tambah Lainnya</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="business_id" className="text-muted">
                    Business plan
                  </Label>
                  {newProject?.base_id === '3' ? (
                    <Select
                      components={animatedComponents}
                      options={options?.business_plan}
                      onChange={(choice) => setBusinessPlan(choice)}
                    />
                  ) : (
                    <Input type="select" disabled defaultValue="" />
                  )}
                  {/* <Input
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
                  </Input> */}
                </FormGroup>
              </Col>
            </Row>
          )}
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
