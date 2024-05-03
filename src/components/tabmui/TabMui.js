import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Badge from '@mui/material/Badge';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { alert } from '../atoms/Toast';
import useAxios from '../../hooks/useAxios';

const TabMui = ({ activeTab, setActiveTab, items, panels, children }) => {
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  const [comment, setComment] = useState();
  const [isApproving, setIsApproving] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  const handleActive = (event, val) => {
    setActiveTab(val);
  };

  const api = useAxios();

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleRevisi = async () => {
    setIsApproving(true);
    await api
      .post(`dapi/vendor/verifikasi/${id}`, { status: 'revisi', komentar: comment })
      .then(() => {
        alert('success', `Informasi revisi telah dikirim`);
      })
      .catch(() => {
        alert('error', 'Gagal mengirim data');
      });
    setModal(false);
    setIsApproving(false);
  };

  return (
    <TabContext value={activeTab}>
      <Card className="mb-1 rounded-3 overflow-hidden" style={{ paddingRight: '7px' }}>
        <div className="d-flex justify-content-between align-items-center">
          <Col md="10">
            <TabList
              aria-label="full width tabs example"
              variant="fullWidth"
              onChange={handleActive}
            >
              {items?.map((item) => (
                <Tab
                  key={item.id}
                  label={
                    <Badge
                      badgeContent={0}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      color="primary"
                      style={{ textTransform: 'capitalize' }}
                    >
                      <strong>{item.title}</strong> &nbsp;&nbsp;
                    </Badge>
                  }
                  value={item.id}
                />
              ))}
            </TabList>
          </Col>
          <Col md="1" className="d-flex justify-content-end">
            <Button type="button" color="warning" outline onClick={toggle.bind(null)}>
              Revisi
            </Button>
            <Modal isOpen={modal} toggle={toggle.bind(null)} centered>
              <ModalHeader toggle={toggle.bind(null)}>Revisi</ModalHeader>
              <ModalBody>
                <div className="d-flex flex-column ">
                  <Label htmlFor="comment">Komentar</Label>
                  <Input
                    type="textarea"
                    id="comment"
                    rows="10"
                    name="comment"
                    onChange={(e) => handleComment(e)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => {
                    handleRevisi();
                  }}
                >
                  {isApproving ? (
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
          </Col>
        </div>
      </Card>
      {panels?.map((panel) => (
        <TabPanel key={panel.id} value={panel.id} className="ps-0 pe-0">
          <Card>
            <CardBody>{children}</CardBody>
          </Card>
        </TabPanel>
      ))}
    </TabContext>
  );
};

TabMui.propTypes = {
  activeTab: PropTypes.number,
  setActiveTab: PropTypes.func,
  items: PropTypes.array,
  panels: PropTypes.array,
  children: PropTypes.element,
};

export default TabMui;
