import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardBody,
  Table,
  Badge,
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  FormGroup,
  Label,
} from 'reactstrap';
import PropTypes from 'prop-types';
import './Review.scss';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

const Review = ({ misal, refetch }) => {
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [idAct, setIdAct] = useState(0);
  const [catatan, setCatatan] = useState('');
  const [modalApprove, setModalApprove] = useState(false);
  const [activity, setActivity] = useState();

  const [activityName, setActivityName] = useState('');
  const [activityPoin, setActivityPoin] = useState(0);
  const [category, setCategory] = useState(0);
  const [assignee, SetAssignee] = useState();

  const activityValueSubmit = {
    id: 0,
    activity: '',
    poin: 0,
    category: 0,
    status: '',
    catatan: '',
  };

  const api = useAxios();

  const { data } = useQuery({
    queryKey: ['cat'],
    queryFn: () =>
      api.get(`dapi/categories`).then((res) => {
        return res.data.data;
      }),
  });

  const toggle = (p) => {
    setModal(!modal);
    if (!modal) {
      setIdAct(p);
    }
  };

  const toggleApprove = (p) => {
    setModalApprove(!modalApprove);
    if (!modalApprove) {
      setIdAct(p.id);
      setActivity(p);
      setActivityName(p.activity);
      setActivityPoin(parseInt(p.poin, 10));
      setCategory(parseInt(p.category, 10));
    }
  };

  const reject = async (e) => {
    activityValueSubmit.status = 'reject';
    activityValueSubmit.catatan = catatan;
    activityValueSubmit.id = idAct;

    if (catatan !== '') {
      e.preventDefault();

      await api
        .post(`dapi/mustreview/review`, activityValueSubmit)
        .then(() => {
          alert('success', `Rejected Succesfully !!`);
          setCatatan('');
          setModal(!modal);
          refetch();
        })
        .catch((err) => {
          alert('error', err);
          setModal(!modal);
        });
    } else {
      setModal(!modal);
      alert('error', `Please Privide your reason !!`);
    }
  };

  const toggle1 = (p) => {
    setModal1(!modal1);
    if (!modal1) {
      SetAssignee(p);
    }
  };

  const approvesubmit = async (e) => {
    activityValueSubmit.status = 'approve';
    activityValueSubmit.id = idAct;
    activityValueSubmit.poin = activityPoin;
    activityValueSubmit.activity = activityName;
    activityValueSubmit.category = category;

    if (activityPoin !== 0) {
      e.preventDefault();

      await api
        .post(`dapi/mustreview/review`, activityValueSubmit)
        .then(() => {
          alert('success', `Approved Succesfully !!`);
          setCatatan('');
          setModalApprove(!modalApprove);
          refetch();
        })
        .catch((err) => {
          alert('error', err);
          setModalApprove(!modalApprove);
        });
    } else {
      setModalApprove(!modalApprove);
      alert('error', 'The Activity Poin must more than 0 !');
    }
  };


  return (
    <>
      <Card>
        <CardBody>
          {misal?.length > 0 ? (
            <Table striped className="mt-2">
              <thead>
                <tr>
                  <th>Activities</th>
                  <th>Poin</th>
                  <th>Done By</th>
                  <th>Progres</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {misal?.map((d) => (
                  <tr key={d.id}>
                    <th scope="row">{d.activity}</th>
                    <th scope="row">{d.poin}</th>

                    <th scope="row">
                      <div className="member" onClick={() => toggle1(d.member)}>
                        {d?.member?.map((m, r) =>
                          r < 3 ? (
                            <img
                              key={m?.employe_id}
                              src={
                                m?.img
                                  ? m?.img
                                  : 'https://i.pinimg.com/736x/10/ec/86/10ec8691f73b787677bd0bbeddbd22e0.jpg'
                              }
                              className="rounded-circle"
                              alt="avatar"
                              width="35"
                              height="35"
                            />
                          ) : (
                            ''
                          ),
                        )}

                        {d?.member?.length > 3 ? (
                          <img
                            src="https://cdn5.vectorstock.com/i/1000x1000/38/64/color-circle-with-plus-icon-vector-13503864.jpg"
                            className="rounded-circle img-pluss"
                            alt="avatar"
                            width="20"
                            height="20"
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </th>
                    <th scope="row">
                      <Badge color="success">{d.progress} % </Badge>
                    </th>
                    <th scope="row">{new Date(d.end).toLocaleString()}</th>
                    <th scope="row">
                      <ButtonGroup size="sm">
                        <Button color="danger" onClick={() => toggle(d.id)}>
                          Reject
                        </Button>
                        <Button color="success" onClick={() => toggleApprove(d)}>
                          Approve
                        </Button>
                      </ButtonGroup>
                    </th>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center mt-2">no data available yet, please come back in a moment</p>
          )}
        </CardBody>
      </Card>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>What the reason ?</ModalHeader>
        <ModalBody>
          <Input
            id="exampleText"
            name="text"
            type="textarea"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
          />
          <div className="d-grid gap-2 mt-3">
            <Button onClick={reject}>Submit</Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={modalApprove} toggle={toggleApprove}>
        <ModalHeader toggle={toggleApprove}>Approve Form</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="activity">Activity</Label>
            <Input
              id="activity"
              name="activity"
              onChange={(e) => setActivityName(e.target.value)}
              value={activityName}
              disabled={parseInt(activity?.poin, 10) !== 0}
            />
          </FormGroup>
          <FormGroup>
            <Label for="activity">Poin</Label>
            <Input
              id="activity"
              name="activity"
              type="number"
              onChange={(e) => setActivityPoin(e.target.value)}
              value={parseInt(activityPoin, 10)}
              disabled={parseInt(activity?.poin, 10) !== 0}
            />
          </FormGroup>
          <FormGroup>
            <Label for="activity">Category</Label>
            <Input
              className="mb-3"
              type="select"
              value={category}
              disabled={parseInt(activity?.poin, 10) !== 0}
              onChange={(e) => setCategory(e.target.value)}
            >
              {data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.category_name}
                </option>
              ))}
            </Input>
          </FormGroup>
          <div className="d-grid gap-2 mt-3">
            <Button onClick={approvesubmit}>Approve</Button>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={modal1} toggle={toggle1}>
        <ModalBody>
          {assignee?.map((a) => (
            <Badge key={a.employe_id} color="primary" className="me-2">
              {a.first_name}
            </Badge>
          ))}
        </ModalBody>
      </Modal>
    </>
  );
};

Review.propTypes = {
  misal: PropTypes.array,
  refetch: PropTypes.func,
};
export default Review;
