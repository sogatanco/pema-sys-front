import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
} from 'reactstrap';
import useAxios from '../../../hooks/useAxios';
import { alert } from '../../../components/atoms/Toast';
import formatDate from '../../../utils/formatDate';

const RequestItem = ({ title, data, source, refetch }) => {
  const [modal, setModal] = useState(false);
  const [modal4, setModal4] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedEmail, setSelectedEmail] = useState();
  const [sendEmailData, setSendEmailData] = useState();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [selectedName, setSelectedName] = useState();
  const [isApproving, setIsApproving] = useState(false);
  const [actLog, setActLog] = useState();

  const toggle = () => {
    setModal(!modal);
  };

  const toggle4 = () => {
    setModal4(!modal4);
  };

  const toggle2 = () => {
    setModal2(!modal2);
  };

  const api = useAxios();

  const handleEmailPopup = (id, email) => {
    setModal(true);
    setSelectedId(id);
    setSelectedEmail(email);
  };

  const handleChange = (e) => {
    setSendEmailData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const sendEmail = async () => {
    setIsSendingEmail(true);
    sendEmailData.email = selectedEmail;

    await api
      .post('dapi/vendor/sendmail', sendEmailData)
      .then(() => {
        alert('success', 'Email berhasil dikirim');
      })
      .catch(() => {
        alert('error', 'Gagal mengirim email');
      });
    setModal(false);
    setIsSendingEmail(false);
  };

  const handleConfirmation = (id, name) => {
    setModal4(true);
    setSelectedId(id);
    setSelectedName(name);
  };

  const fetchLog = async (id) => {
    await api
      .get(`dapi/vendor/log/${id}`)
      .then((res) => setActLog(res.data.data))
      .catch((err) => console.log(err));
  };

  const handleLogModal = (id, name) => {
    setModal2(true);
    setSelectedName(name);
    fetchLog(id);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    await api
      .post(`dapi/vendor/verifikasi/${selectedId}`, { status: 'terverifikasi' })
      .then(() => {
        refetch();
        alert('success', `Data Perusahaan ${selectedName} telah terverifikasi.`);
      })
      .catch(() => {
        alert('error', 'Gagal mengirim data');
      });
    setModal4(false);
    setIsApproving(false);
  };

  return (
    <Col lg="12">
      <Card className="">
        <CardBody className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-between">
            <CardTitle tag="h4">{title}</CardTitle>
            <Link to="projects" style={{ textDecoration: 'none' }}></Link>
          </div>
          {data?.length > 0
            ? data.map((item) => (
                <div
                  key={item.perusahaan_id}
                  className="d-flex justify-content-between rounded-3 px-3 py-3 align-items-center text-dark bg-light"
                >
                  <div className="d-flex flex-column">
                    <h4 className="fw-bold">
                      {item.bentuk_usaha} {item.nama_perusahaan}
                    </h4>
                    <small>Request at {formatDate(item.updated_at)}</small>
                  </div>
                  <div className="d-flex gap-3">
                    <Link to={`check/${item.perusahaan_id}?source=${source}`}>
                      <Button type="button" color="secondary">
                        Document
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => handleEmailPopup(item.perusahaan_id, item.email)}
                    >
                      Email
                    </Button>
                    <Modal isOpen={modal} toggle={toggle.bind(null)} centered size="lg">
                      <ModalHeader toggle={toggle.bind(null)}>Kirim Email</ModalHeader>
                      <ModalBody>
                        <h4>To: {selectedEmail}</h4>
                        <hr />
                        <Label htmlFor="subject">Add subject </Label>
                        <Input
                          type="text"
                          id="subject"
                          name="subject"
                          onChange={(e) => handleChange(e)}
                        />
                        <Input
                          type="textarea"
                          id="content"
                          name="content"
                          className="mt-4"
                          rows="10"
                          onChange={(e) => handleChange(e)}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={sendEmail} disabled={isSendingEmail}>
                          {isSendingEmail ? (
                            <div className="d-flex align-items-center gap-2">
                              <Spinner size="sm" />
                              Mengirim..
                            </div>
                          ) : (
                            'Kirim'
                          )}
                        </Button>
                        <Button color="secondary" outline onClick={toggle.bind(null)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                    <Button
                      color="secondary"
                      onClick={() => handleConfirmation(item.perusahaan_id, item.nama_perusahaan)}
                    >
                      Approve
                    </Button>
                    <Modal isOpen={modal4} toggle={toggle4.bind(null)} centered>
                      <ModalHeader toggle={toggle4.bind(null)}>Konfirmasi</ModalHeader>
                      <ModalBody>
                        <div className="d-flex text-center">
                          <p>
                            {' '}
                            Data perusahaan <strong>{selectedName}</strong> akan diubah menjadi
                            terverifikasi. Lanjutkan?
                          </p>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        {isApproving ? (
                          <Button type="button" color="primary" disabled>
                            <div className="d-flex align-items-center gap-2">
                              <Spinner size="sm" />
                              Loading..
                            </div>
                          </Button>
                        ) : (
                          <Button type="button" color="primary" onClick={handleApprove}>
                            Ya
                          </Button>
                        )}
                        <Button color="secondary" onClick={toggle4.bind(null)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                    <Button
                      color="secondary"
                      outline
                      onClick={() => handleLogModal(item.perusahaan_id, item.nama_perusahaan)}
                    >
                      Log
                    </Button>
                    <Modal isOpen={modal2} toggle={toggle2.bind(null)} centered size="lg">
                      <ModalHeader toggle={toggle2.bind(null)}>Log</ModalHeader>
                      <ModalBody style={{ height: '500px', overflow: 'auto' }}>
                        <Table hover>
                          <tbody>
                            {actLog?.map((l) => (
                              <tr key={l.id_log}>
                                <td>{l.aktifitas}</td>
                                <td>{formatDate(l.created_at)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="secondary" onClick={toggle2.bind(null)}>
                          Tutup
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                </div>
              ))
            : 'No data.'}
        </CardBody>
      </Card>
    </Col>
  );
};

RequestItem.propTypes = {
  source: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.array,
  refetch: PropTypes.func,
};

export default RequestItem;
