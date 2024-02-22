import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import MaterialIcon from '@material/react-material-icon';
import useAxios from '../../hooks/useAxios';
import newDate from '../../utils/formatDate';
import { alert } from '../../components/atoms/Toast';

const ReviewTab = ({ setTotalReview }) => {
  const { projectId } = useParams();
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState('');
  const [taskId, setTaskId] = useState();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState();
  const [employeId, setEmployeId] = useState();
  const api = useAxios();
  const [listReview, setListReview] = useState([]);

  const { isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['review'],
    queryFn: () =>
      api.get(`api/task/${projectId}/level1/review`).then((res) => {
        setListReview(res.data.data);
        return res.data.data;
      }),
  });

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    setTotalReview(listReview.length);
  }, [listReview]);

  useEffect(() => {
    refetch();
  }, [projectId]);

  const fileUrl = process.env.REACT_APP_FILEURL;

  const handleForm = (modeRes, task, employe) => {
    setModal(true);
    setMode(modeRes);
    setTaskId(task);
    setEmployeId(employe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api
      .put(`api/task/${taskId}/status`, {
        employe_id: employeId,
        status: mode === 'approve' ? 3 : 4,
        note: comments,
      })
      .then(() => {
        alert('success', `Task has been ${mode === 'approve' ? 'approved' : 'reviewed'}`);
      })
      .catch((err) => console.log(err));
    refetch();
    setModal(false);
    setLoading(false);
  };

  return (
    <>
      <Col>
        {isLoading || isRefetching ? (
          // {isLoading ? (
          <div className="d-flex justify-content-center">Loading...</div>
        ) : error ? (
          <div className="d-flex justify-content-center">
            Something went wrong <span className="material-icons">sentiment_very_dissatisfied</span>
          </div>
        ) : (
          listReview.map((task, i) => (
            <Card key={task.approval_id} className="custom-card">
              <CardBody>
                <CardTitle tag="h4" className="d-flex justify-content-between">
                  <div className="d-flex gap-2">
                    <Badge color="light" className="text-dark">
                      #{i + 1}
                    </Badge>
                    <Badge color="info" className="">
                      {task.first_name}
                    </Badge>
                  </div>
                  <span style={{ fontSize: '14px' }}>{newDate(task.send_date)}</span>
                </CardTitle>
                <h5>
                  <strong>{task.task_title}</strong>
                </h5>
                <p>{task.task_desc}</p>
                <span className="text-dark">Attachment:</span>
                <div className="">
                  {task.files.length > 0
                    ? task.files.map((f, idx) => (
                        <div key={f.file_name} className="d-flex gap-3">
                          <span>{idx + 1}.</span>
                          <Link
                            className="file-link"
                            to={`${fileUrl}taskfiles/${f.file_name}`}
                            target="blank"
                          >
                            {f.file_name}
                          </Link>
                        </div>
                      ))
                    : '-'}
                </div>
                <div
                  className="d-flex justify-content-between align-items-center mt-4 border  py-2 px-3"
                  style={{ borderRadius: '10px' }}
                >
                  <div className="d-flex gap-4">
                    <div color="muted">
                      <span className="text-dark">Start at: </span>
                      <br /> {newDate(task.start_date)?.split(',')[0]}
                    </div>
                    <div color="muted">
                      <span className="text-dark">Due at: </span>
                      <br /> {newDate(task.end_date)?.split(',')[0]}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      type="button"
                      size="md"
                      color="warning"
                      outline
                      onClick={() => handleForm('revision', task.task_id, task.employe_id)}
                    >
                      Revision
                    </Button>
                    <Button
                      type="button"
                      size="md"
                      color="success"
                      onClick={() => handleForm('approve', task.task_id, task.employe_id)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
        {/* <Card>
        <CardBody>
        <CardTitle tag="h4">
        <Badge color="success">Approved</Badge>
        </CardTitle>
        <Table className="no-wrap mt-3 align-middle" hover style={{ zIndex: '-1' }}>
        <thead>
        <tr>
        <th>#</th>
        <th>Employee</th>
        <th>Task</th>
        <th>Attachment</th>
        <th>Approved at</th>
        </tr>
        </thead>
        <tbody>
        {data.map((task, i) => (
            <tr key={task.approval_id}>
            <td>{i + 1}</td>
            <td>{task.first_name}</td>
            <td>{task.task_title}</td>
            <td>{task.file}</td>
            <td>{newDate(task.created_at)}</td>
            </tr>
            ))}
            </tbody>
            </Table>
            </CardBody>
        </Card> */}
      </Col>
      <Modal isOpen={modal} toggle={toggle.bind(null)} size="md" fade={false} centered>
        <ModalHeader toggle={toggle.bind(null)}>
          {mode === 'approve' ? 'Approval' : 'Revision'}
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup>
              <Input
                type="textarea"
                id="goals"
                name="goals"
                placeholder="Comment here.."
                rows="3"
                required
                onChange={(e) => setComments(e.target.value)}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" outline onClick={toggle.bind(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              color={`${mode === 'approve' ? 'success' : 'warning'}`}
              disabled={loading}
              className="d-flex gap-1 align-items-center"
            >
              {loading ? (
                <>
                  <Spinner className="me-2" size="sm" />
                  Sending...
                </>
              ) : (
                <>
                  <MaterialIcon icon="send" style={{ fontSize: '20px' }} />
                  {mode === 'approve' ? 'Approve' : 'Send'}
                </>
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

ReviewTab.propTypes = {
  setTotalReview: PropTypes.func,
};

export default ReviewTab;
