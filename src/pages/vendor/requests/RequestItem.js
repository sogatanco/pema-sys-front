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
} from 'reactstrap';

const RequestItem = ({ title, data, source }) => {
  const [modal, setModal] = useState(false);
  const [modal4, setModal4] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedEmail, setSelectedEmail] = useState();
  const [selectedName, setSelectedName] = useState();
  const toggle = () => {
    setModal(!modal);
  };

  const toggle4 = () => {
    setModal4(!modal4);
  };

  const handleEmailPopup = (id, email) => {
    setModal(true);
    setSelectedId(id);
    setSelectedEmail(email);
  };

  const handleConfirmation = (id, name) => {
    setModal4(true);
    setSelectedId(id);
    setSelectedName(name);
  };

  console.log(selectedId);

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
                <div className="d-flex justify-content-between rounded-3 px-3 py-3 align-items-center text-dark bg-light">
                  <h4 className="fw-bold">{item.nama_perusahaan}</h4>
                  <div className="d-flex gap-3">
                    <Link to={`check/${item.id}?source=${source}`}>
                      <Button type="button" color="secondary">
                        Document
                      </Button>
                    </Link>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => handleEmailPopup(item.id, item.email)}
                    >
                      Email
                    </Button>
                    <Modal isOpen={modal} toggle={toggle.bind(null)} centered size="lg">
                      <ModalHeader toggle={toggle.bind(null)}>Kirim Email</ModalHeader>
                      <ModalBody>
                        <h4>To: {selectedEmail}</h4>
                        <hr />
                        <Label htmlFor="subject">Add subject </Label>
                        <Input type="text" id="subject" name="subject" />
                        <Input type="textarea" id="content" name="content" className="mt-4" />
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={toggle.bind(null)}>
                          Kirim
                        </Button>
                        <Button color="secondary" outline onClick={toggle.bind(null)}>
                          Cancel
                        </Button>
                      </ModalFooter>
                    </Modal>
                    <Button
                      color="secondary"
                      onClick={() => handleConfirmation(item.id, item.nama_perusahaan)}
                    >
                      Approve
                    </Button>
                    <Modal isOpen={modal4} toggle={toggle4.bind(null)} centered>
                      <ModalHeader toggle={toggle4.bind(null)}>Konfirmasi</ModalHeader>
                      <ModalBody>
                        <div className="d-flex text-center">
                          Data perusahaan {selectedName} akan diubah menjadi terverifikasi.
                          Lanjutkan?
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="primary" onClick={toggle4.bind(null)}>
                          Ya
                        </Button>
                        <Button color="secondary" onClick={toggle4.bind(null)}>
                          Cancel
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
};

export default RequestItem;
