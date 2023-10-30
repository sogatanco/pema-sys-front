import React, { useState } from 'react';
import { Card, Badge, Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import PropTypes from 'prop-types';
import './TaskBoard.scss';
import MaterialIcon from '@material/react-material-icon';
import Slider from '@mui/material/Slider';
import { confirmAlert } from 'react-confirm-alert'; // Import
import ActionMenu from '../../components/actionMenu/ActionMenu';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const animatedComponents = makeAnimated();

const TaskBoard = ({ data, isLoading, employe, refetch }) => {
  const menuOptions = {
    options: [
      {
        id: 1,
        icon: <MaterialIcon icon="edit_note" />,
        type: 'button',
        label: 'Delete',
        to: 1,
      },
    ],
  };

  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [createdId, setCreatedId] = useState();
  const [idTaskUpdate, setIdTaskUpdate] = useState();
  const [newMem, setNewMem] = useState();
  const [modal, setModal] = useState(false);
  const [modalProgress, setModalProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modal1, setModal1] = useState(false);
  const [assignee, SetAssignee] = useState();

  const api = useAxios();
  const valueSubmit = {
    id: 0,
    new_member: '',
  };

  const dataProgress = {
    id: 0,
    progress: 0,
  };

  const dataDelete = {
    id: 0,
  };
  const changeAssign = (choice) => {
    setAssignedEmployees(choice);
    const s = choice.filter((c) => c.value !== createdId);
    const newMember = [`//${createdId}//`];
    s.map((r) => newMember.push(`//${r.value}//`));
    setNewMem(newMember.toLocaleString());
  };

  const toggle = (p, idd) => {
    setModal(!modal);
    setCreatedId(p[0]?.employe_id);
    setIdTaskUpdate(idd);
    if (!modal) {
      const dataMember = [];
      p.map((s) => dataMember.push({ label: s.first_name, value: s.employe_id }));
      setAssignedEmployees(dataMember);
    }
  };

  const toggleProgress = (id, prog) => {
    setIdTaskUpdate(id);
    setModalProgress(!modalProgress);

    if (!modalProgress) {
      setProgress(parseInt(prog, 10));
      console.log(id);
    }
  };

  const updateDataAssign = async (e) => {
    console.log(newMem);
    console.log(idTaskUpdate);
    valueSubmit.id = idTaskUpdate;
    valueSubmit.new_member = newMem;

    e.preventDefault();
    await api.post(`dapi/myactivity/update`, valueSubmit).then(() => {
      setModal(!modal);
      alert('success', `Task Members has been updated !`);
      refetch();
    });
  };

  const updateProgress = async (e) => {
    dataProgress.id = idTaskUpdate;
    dataProgress.progress = progress;
    console.log(dataProgress);
    e.preventDefault();

    await api.post(`dapi/myactivity/progress`, dataProgress).then(() => {
      setModalProgress(!modalProgress);
      alert('success', `Progress has been updated !`);
      refetch();
    });
  };

  const actionMenu = async (taskId, to) => {
    if (to === 1) {
      dataDelete.id = taskId;

      await confirmAlert({
        title: `Are you sure ?`,
        message: `Be careful, what has gone will not come back`,
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              api.post(`dapi/myactivity/delete`, dataDelete).then(() => {
                alert('success', `Activity Deleted !`);
                refetch();
              });
            },
          },
          {
            label: 'No',
            onClick: () => {},
          },
        ],
      });
    }
  };

  const toggle1 = (p) => {
    setModal1(!modal1);
    if (!modal1) {
      SetAssignee(p);
    }
  };

  return isLoading ? (
    'Loading'
  ) : (
    <>
      {data?.map((act) => (
        <Card body key={act.id} className="mb-2">
          <div className="d-flex justify-content-between">
            <Badge className="img-pluss" color="info" style={{ height: 'max-content' }}>
              {act.category_name}
            </Badge>
            {parseInt(act.progress, 10)===100?<small>{act.status}</small>:<ActionMenu
              menuOptions={menuOptions}
              taskId={act.id}
              status={parseInt(act.status, 10)}
              progress={parseInt(act.progress, 10)}
              action={actionMenu}
            />}
          </div>
          <div className="board-body">
            <div className="task-title fw-bold">{act.activity}</div>
            <div className="d-flex justify-content-between">
              <small className="text-muted">Start : {act.start}</small>
              <small className="text-muted">End : {act.end}</small>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            {act.status!=='approve'?<div className="member">
              {act?.member?.map((m, r) =>
                r < 2 ? (
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
              {act?.status!=='approve'?<div onClick={() => toggle(act?.member, act?.id)}>
                <img
                  src="https://cdn5.vectorstock.com/i/1000x1000/38/64/color-circle-with-plus-icon-vector-13503864.jpg"
                  className="rounded-circle img-pluss"
                  alt="avatar"
                  width="20"
                  height="20"
                />
              </div>:''}
              {/* here */}
            </div>:<div className='member' onClick={()=>toggle1(act.member)}>
            {act?.member?.map((m, r) =>
                r < 2 ? (
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
              </div>}
            {act.status==='approve'?
            <Badge
            className="img-pluss"
            color={parseInt(act.progress,10)===0?'danger':parseInt(act.progress,10)===100?'success':'warning'}
            style={{ height: 'max-content' }}
          >
            Progress : {act.progress}%
          </Badge>
            :<Badge
              className="img-pluss"
              color={parseInt(act.progress,10)===0?'danger':parseInt(act.progress,10)===100?'success':'warning'}
              style={{ height: 'max-content' }}
              onClick={() => toggleProgress(act?.id, act.progress)}
            >
              Progress : {act.progress}%
            </Badge>}
          </div>
        </Card>
      ))}

      {/* modal assign */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Another Employee</ModalHeader>
        <ModalBody>
          <Select
            // closeMenuOnSelect={true}
            components={animatedComponents}
            isMulti
            value={assignedEmployees}
            options={employe}
            onChange={changeAssign}
            isClearable={assignedEmployees.some((v) => !v.isFixed)}
          />

          <div className="d-grid gap-2 mt-3">
            <Button onClick={updateDataAssign}>Update Data</Button>
          </div>
        </ModalBody>
      </Modal>

      {/* modal progress */}
      <Modal isOpen={modalProgress} toggle={toggleProgress}>
        <ModalHeader toggle={toggleProgress}>Live Progress ({`${progress}%`})</ModalHeader>
        <ModalBody>
          <Slider
            value={typeof progress === 'number' ? progress : 0}
            onChange={(e, newVal) => setProgress(newVal)}
            aria-labelledby="input-slider"
          />
          <div className="d-grid gap-2 mt-3">
            <Button onClick={updateProgress}>Submit Update</Button>
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

TaskBoard.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  employe: PropTypes.array,
  refetch: PropTypes.func,
};

export default TaskBoard;
