import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from 'reactstrap';
import PropTypes from 'prop-types';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

const EditProjectModal = ({ modal, setModal, toggle, data, refetch }) => {
  const [projectData, setProjectData] = useState({});
  const [dataUpdate, setDataUpdate] = useState({});
  const [options, setOptions] = useState({});
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = useAxios();

  useEffect(() => {
    setProjectData(data);
    setDataUpdate({
      project_number: data?.project_number,
      project_name: data?.project_name,
      goals: data?.goals,
      estimated_income: data?.estimated_income,
      estimated_cost: data?.estimated_cost,
      base_id: data?.base_id,
      level_id: data?.level_id,
      business_id: data?.business_id,
      category: data?.category,
      start_date: data?.current_stage?.start_date,
      end_date: data?.current_stage?.end_date,
      desc: data?.current_stage?.desc,
      partner: data?.current_stage?.partner_id,
    });
  }, [data]);

  useEffect(() => {
    async function fetchBusinessOptions() {
      await api
        .get(`api/project/business/options`)
        .then((res) => setOptions(res.data))
        .catch((err) => console.log(err));
    }
    async function fetchPartnerOptions() {
      await api
        .get(`api/list-mitra`)
        .then((res) => setPartnerOptions(res.data.data))
        .catch((err) => console.log(err));
    }

    fetchBusinessOptions();
    fetchPartnerOptions();
  }, []);

  const handleChange = (e) => {
    setDataUpdate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    dataUpdate.stage_id = projectData?.current_stage?.stage_id;

    await api
      .put(`api/project/${projectData?.project_id}/update`, dataUpdate)
      .then(() => {
        refetch();
        alert('success', 'Project has been updated.');
      })
      .catch(() => {
        alert('error', 'Something went wrong.');
      });
    setLoading(false);
    setModal(false);
  };

  return (
    <>
      <Modal isOpen={modal} toggle={toggle.bind(null)} size="lg" fade={false}>
        <ModalHeader toggle={toggle.bind(null)}>Update Project</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Label htmlFor="project_number">Project Number</Label>
              <Input
                type="text"
                name="project_number"
                id="project_number"
                placeholder="Project number here"
                onChange={handleChange}
                defaultValue={projectData?.project_number || ''}
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
                defaultValue={projectData?.project_name}
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
                    defaultValue={projectData?.current_stage?.start_date || ''}
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <Label for="end_date">End date</Label>
                  <Input
                    type="date"
                    id="end_date"
                    name="end_date"
                    onChange={handleChange}
                    defaultValue={projectData?.current_stage?.end_date || ''}
                  />
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
                defaultValue={projectData?.goals || ''}
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
                    onChange={handleChange}
                    defaultValue={projectData?.level_id || ''}
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
              <Col md="6">
                <FormGroup>
                  <Label for="category">Category</Label>
                  <Input
                    type="select"
                    id="category"
                    name="category"
                    onChange={handleChange}
                    defaultValue={projectData?.category || ''}
                  >
                    <option disabled value="cat">
                      - Select -
                    </option>
                    <option value="business">Business</option>
                    <option value="non-business">Non-business</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            {projectData?.category === 'business' && (
              <>
                <FormGroup>
                  <Label for="partner">Partner</Label>
                  <Input
                    type="select"
                    id="partner"
                    name="partner"
                    defaultValue={projectData?.current_stage?.partner_name || 'pa'}
                    onChange={handleChange}
                  >
                    <option disabled value="pa">
                      - Select -
                    </option>
                    {partnerOptions.length > 0 &&
                      partnerOptions.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                  </Input>
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
                    defaultValue={projectData?.current_stage?.desc}
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
                          defaultValue={projectData?.estimated_income || ''}
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
                          defaultValue={projectData?.estimated_cost || ''}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
              </>
            )}
            <Row>
              <Col md="6">
                <FormGroup>
                  <Label for="base_id">Activity base</Label>
                  <Input
                    type="select"
                    id="base_id"
                    name="base_id"
                    defaultValue={projectData?.base_id || ''}
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
                    disabled={projectData?.base_id?.toString() !== '3'}
                    onChange={handleChange}
                    defaultValue={projectData?.business_id || ''}
                  >
                    {projectData?.base_id?.toString() === '3' && (
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
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="info" disabled={loading}>
              {loading ? (
                <>
                  <Spinner className="me-2" size="sm" color="light" />
                  Loading ...
                </>
              ) : (
                'Update'
              )}
            </Button>
            <Button color="secondary" outline onClick={toggle.bind(null)}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

EditProjectModal.propTypes = {
  modal: PropTypes.bool,
  setModal: PropTypes.func,
  toggle: PropTypes.any,
  data: PropTypes.object,
  refetch: PropTypes.func,
};

export default EditProjectModal;
