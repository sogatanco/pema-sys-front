import MaterialIcon from '@material/react-material-icon';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';
import TicketTable from './TicketTable';

const TicketList = () => {
  const { auth } = useAuth();
  const [modal, setModal] = useState();
  const [listEmployee, setListEmployee] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const animatedComponents = makeAnimated();

  const api = useAxios();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['ticketlist'],
    queryFn: () =>
      // api.get(`api/task/${auth?.user.employe_id}/recent/activity`).then((res) => {
      api.get(`api/ticket/employe`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    async function fetchEmployees() {
      await api
        .get(`api/employe/assignment-list`)
        .then((res) => {
          setListEmployee(res.data.data);
        })
        .catch((err) => console.log(err));
    }

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataSubmit = {
      title,
      subject,
      desc,
      pic: selectedEmployee.value,
      priority,
    };
    setIsSubmitting(true);
    await api
      .post('api/ticket', dataSubmit)
      .then((res) => {
        refetch();
        alert('success', res.data.message);
      })
      .catch(() => {
        alert('error', 'Submit ticket failed.');
      });
    setModal(false);
    setIsSubmitting(false);
  };

  return (
    <>
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <Col className="d-flex justify-content-between" col="12">
                <div className="">
                  <CardTitle tag="h5" className="fw-bold">
                    Ticket Listing
                  </CardTitle>
                </div>
                <Button
                  className="btn d-flex gap-1 align-items-center"
                  outline
                  color="info"
                  size="sm"
                  onClick={toggle.bind(null)}
                >
                  <MaterialIcon icon="add" />
                  New Ticket
                </Button>
              </Col>
              {isLoading ? (
                'Loading...'
              ) : error ? (
                'Something went wrong.'
              ) : data.length > 0 ? (
                <TicketTable {...{ data }} />
              ) : (
                <div className="d-flex justify-content-center">No data yet.</div>
              )}
            </CardBody>
          </Card>
          <Modal isOpen={modal} fade={false} toggle={toggle.bind(null)} size="lg">
            <form onSubmit={handleSubmit}>
              <ModalHeader toggle={toggle.bind(null)}>New Request</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Row>
                    <Label sm="3">Requester</Label>
                    <Col sm="9">
                      <Input type="text" value={auth?.user.first_name} readOnly disabled />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Label sm="3">Subject</Label>
                    <Col sm="9">
                      <Input
                        type="select"
                        defaultValue="choose"
                        onChange={(e) => setSubject(e.target.value)}
                      >
                        <option value="choose">Choose...</option>
                        <option value="request">Request</option>
                        <option value="troubleshoot">Troubleshoot</option>
                      </Input>
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Label sm="3">Title</Label>
                    <Col sm="9">
                      <Input type="text" onChange={(e) => setTitle(e.target.value)} />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Label sm="3">Description</Label>
                    <Col sm="9">
                      <Input type="textarea" onChange={(e) => setDesc(e.target.value)} />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Label sm="3">To</Label>
                    <Col sm="9">
                      <Select
                        components={animatedComponents}
                        options={listEmployee}
                        onChange={(choice) => setSelectedEmployee(choice)}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Label sm="3">Priority</Label>
                    <Col sm="9">
                      <Input
                        type="select"
                        defaultValue="choose"
                        onChange={(e) => setPriority(e.target.value)}
                      >
                        <option value="choose">Choose...</option>
                        <option value="minor">Minor</option>
                        <option value="major">Major</option>
                        <option value="emergency">Emergency</option>
                      </Input>
                    </Col>
                  </Row>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={toggle.bind(null)}>
                  Cancel
                </Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="d-flex align-items-center gap-1">
                      <Spinner size="sm" />
                      Submitting
                    </div>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </ModalFooter>
            </form>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default TicketList;
