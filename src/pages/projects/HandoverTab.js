import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import MaterialIcon from '@material/react-material-icon';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import newDate from '../../utils/formatDate';
import user1 from '../../assets/images/users/user1.jpg';

const HandoverTab = () => {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { auth } = useAuth();
  const { projectId } = useParams();
  const api = useAxios();

  const toggle = () => {
    setModal(!modal);
  };

  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ['review'],
    queryFn: () =>
      api.get(`api/project/${auth?.user.employe_id}/${projectId}/handover`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    setSuccess('');
    setErrorMsg('');
  }, [data]);

  const fileUrl = process.env.REACT_APP_FILEURL;

  const handleConfirm = async () => {
    setLoading(true);
    api
      .get(`project/${data?.history_id}/confirm`)
      .then((res) => {
        setSuccess(res.data.message);
        refetch();
      })
      .catch((err) => {
        setErrorMsg(err.response.data.error);
      });
    setTimeout(() => {
      setModal(false);
    }, 5000);
    setLoading(false);
  };

  return (
    <>
      <Col>
        {isLoading || isRefetching ? (
          <div className="d-flex justify-content-center">Loading...</div>
        ) : error ? (
          <div className="d-flex justify-content-center">
            Something went wrong <span className="material-icons">sentiment_very_dissatisfied</span>
          </div>
        ) : (
          data !== null && (
            <Card className="custom-card">
              <CardBody>
                <CardTitle tag="h4" className="d-flex justify-content-between">
                  <div className="d-flex gap-2">
                    <Badge color="light" className="text-dark">
                      Handover project
                    </Badge>
                  </div>
                  <span style={{ fontSize: '14px' }}>{newDate(data.created_at)}</span>
                </CardTitle>
                <div className="d-flex  justify-content-center">
                  <h5>
                    Handover of the project from <strong>{data.from_division}</strong> to{' '}
                    <strong>{data.to_division}</strong>
                  </h5>
                </div>
                <p></p>
                <span className="text-dark">Handover File:</span>
                <div className="">
                  <div className="d-flex gap-3">
                    <Link
                      className="file-link"
                      to={`${fileUrl}project/${data.file}`}
                      target="blank"
                    >
                      {data.file}
                    </Link>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-between align-items-center mt-4 border  py-2 px-3"
                  style={{ borderRadius: '10px' }}
                >
                  <div className="d-flex gap-4">
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        src={user1}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                      />
                      <div className="d-flex flex-column">
                        <span className="text-dark fw-bold">{data.old_pic}</span>
                        <small className="text-muted">{data.from_division}</small>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      type="button"
                      size="md"
                      color="success"
                      outline
                      onClick={toggle.bind(null)}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        )}
      </Col>
      <Modal isOpen={modal} toggle={toggle.bind(null)} size="md" fade={false} centered>
        <ModalHeader toggle={toggle.bind(null)}>Confirmation</ModalHeader>
        <ModalBody className="d-flex justify-content-center">
          {success ? (
            <>
              <MaterialIcon icon="check_circle_outline" color="success" />
              {'  '}
              {success}
            </>
          ) : errorMsg ? (
            <>
              <MaterialIcon icon="highlight_off" color="success" />
              {'  '}
              {errorMsg}
            </>
          ) : (
            'Do you want to accept this project?'
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" outline onClick={toggle.bind(null)}>
            Cancel
          </Button>
          <Button
            type="button"
            color="success"
            disabled={loading}
            className="d-flex gap-1 align-items-center"
            onClick={handleConfirm}
          >
            {loading ? (
              <>
                <Spinner className="me-2" size="sm" color="light" />
                Sending
              </>
            ) : (
              'Yes'
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default HandoverTab;
