import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { Badge, Button, ModalBody, ModalHeader, Modal, Col, Row, ModalFooter } from 'reactstrap';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

const Request = ({ reqser, refetch2 }) => {
  const { auth } = useAuth();
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [dat, setDat] = useState();
  const api = useAxios();

  const toggle = () => setModal(!modal);
  const toggle2 = () => setModal2(!modal2);
  const setData = (row) => {
    setDat(row);
    console.log(row);
  };

  const processButton = async () => {
    const vprocess = { id: dat.id, status: 'progress' };
    await api.post(`dapi/inven/service/update`, vprocess).then((res) => {
      if (res?.data?.success) {
        alert('success', `service status changed succesfully !`);
        refetch2();
      }
    }).catch((err) => {
      alert('error', err);
    });
  }

  const reportButton = () => {
    toggle2()

  }


  const columns = [
    {
      name: 'Asset Number',
      selector: (row) => row.asset_number,
    },
    {
      name: 'Asset Name',
      selector: (row) => row.asset_name,
    },
    {
      name: 'Complaint',
      selector: (row) => row.complaint,
    },
    {
      name: 'Request By',
      selector: (row) => row.requester,
    },
    {
      name: 'Requested at',
      selector: (row) => new Date(row.created_at).toLocaleString(),
    },
    {
      name: <>{auth.user.roles.includes('PicAsset') ? 'Action' : 'Status'}</>,
      selector: (row) => (
        <>
          {auth.user.roles.includes('PicAsset') ? (
            <>
              {row.status === 'submit' ? (
                <Button
                  size="sm"
                  onClick={() => {
                    toggle();
                    setData(row);
                  }}
                >
                  Check
                </Button>
              ) : (
                <>{row.status === 'progress' ? <Button size="sm" color='success' onClick={() => { setData(row); reportButton(); }}>Report</Button> : ''}</>
              )}
            </>
          ) : (
            <Badge color="secondary">{row.status}</Badge>
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <DataTable columns={columns} data={reqser} pagination />

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{dat?.asset_name}</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={5}>Nomor Aset</Col>
            <Col xs={7}>: {dat?.asset_number}</Col>
            <Col xs={5}>Keluhan</Col>
            <Col xs={7}>: {dat?.complaint}</Col>
            <Col xs={5}>Location</Col>
            <Col xs={7}>: {dat?.location}</Col>
            <Col xs={5}>Detail</Col>
            <Col xs={7}>
              :{' '}
              <a href={`/asset/${dat?.asset_id}`} target="_blank" rel="noreferrer">
                view
              </a>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-success" onClick={processButton}>Process</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modal2} toggle={toggle2}>
        <ModalHeader toggle={toggle2}>{dat?.asset_name}</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={5}>Nomor Aset</Col>
            <Col xs={7}>: {dat?.asset_number}</Col>
            <Col xs={5}>Keluhan</Col>
            <Col xs={7}>: {dat?.complaint}</Col>
            <Col xs={5}>Location</Col>
            <Col xs={7}>: {dat?.location}</Col>
            <Col xs={5}>Detail</Col>
            <Col xs={7}>
              :{' '}
              <a href={`/asset/${dat?.asset_id}`} target="_blank" rel="noreferrer">
                view
              </a>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button className="btn btn-success" onClick={processButton}>Done</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

Request.propTypes = {
  reqser: PropTypes.array,
  refetch2: PropTypes.func,
};

export default Request;
