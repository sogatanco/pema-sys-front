import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';
import useAuth from '../../hooks/useAuth';
// import useAuth from '../../hooks/useAuth';

const TaskFormAddSub = ({
  itemValue,
  setIsAddingItem,
  setShowAddSub,
  selectedActivityId,
  setSelectedActivityId,
  setItemValue,
  refetch,
}) => {
  const { auth } = useAuth();
  const [modal, setModal] = useState(false);
  const [assignedEmployees, setAssignedEmployees] = useState({});
  const [listEmployee, setListEmploye] = useState();

  const animatedComponents = makeAnimated();

  const toggle = () => {
    setModal(!modal);
  };

  const api = useAxios();

  useEffect(() => {
    async function fetchEmployees() {
      await api
        .get(`api/employe/assignment-list?search=subordinate`)
        .then((res) => {
          setListEmploye(res.data.data);
        })
        .catch((err) => console.log(err));
    }

    fetchEmployees();

    setAssignedEmployees({
      value: auth?.user.employe_id,
      label: auth?.user.first_name,
    });
  }, []);

  const handleAddItem = async () => {
    if (itemValue === '') {
      alert('error', 'Field cannot be empty');
    } else if (Object.keys(assignedEmployees)?.length === 0) {
      alert('error', 'Please select an employee');
    } else {
      setIsAddingItem(true);

      const dataSub = {
        sub: [
          {
            sub: itemValue,
            status: 'created',
            employe_id: assignedEmployees?.value,
          },
        ],
      };

      await api
        .patch(`api/task/${selectedActivityId}/activity/add-sub`, dataSub)
        .then(() => {
          refetch();
        })
        .catch(() => alert('error', 'Action failed'));
      setSelectedActivityId();
      setShowAddSub(false);
      setIsAddingItem(false);
      setItemValue({});
      setAssignedEmployees({});
    }
  };

  //   const handleChange = (e) => {
  //     setItemValue(e);
  //     // if (e.key === 'Enter') {
  //     //   e.preventDefault();
  //     //   handleAddItem(e);
  //     // }
  //   };

  const assigneModal = (val) => {
    setModal(val);
  };

  return (
    <div className="form-wrap">
      <div className="form-input">
        <input
          type="text"
          placeholder="Add Sub Activity..."
          //   onKeyDown={(e) => handleChange(e)}
          onChange={(e) => setItemValue(e.target.value)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        ></input>
      </div>
      <div className="form-assigne">
        <div className="assigne">
          <button
            type="button"
            className="btn-assigne"
            id="tooltip-2"
            onClick={() => assigneModal(true)}
          >
            <i
              className={`${
                auth?.user?.roles.includes('Staff') ? 'bi-person-fill' : 'bi-person-plus-fill'
              }`}
            ></i>
          </button>
          <span>{assignedEmployees.label}</span>
        </div>
        <div className="action">
          <Button
            className="btn-cancel"
            type="button"
            size="sm"
            color="light"
            onClick={() => {
              setShowAddSub(false);
              setSelectedActivityId(undefined);
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            // className="btn-save"
            onClick={() => handleAddItem()}
          >
            Save
          </Button>
        </div>
        <Modal isOpen={modal} toggle={toggle.bind(null)} size="md" fade={false} centered>
          <ModalHeader toggle={toggle.bind(null)}>Assign to</ModalHeader>
          <ModalBody>
            <Select
              // closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={assignedEmployees}
              options={listEmployee}
              onChange={(choice) => {
                setAssignedEmployees(choice);
                assigneModal(false);
              }}
            />
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

TaskFormAddSub.propTypes = {
  itemValue: PropTypes.string,
  setIsAddingItem: PropTypes.func,
  setShowAddSub: PropTypes.func,
  selectedActivityId: PropTypes.number,
  setSelectedActivityId: PropTypes.func,
  setItemValue: PropTypes.func,
  refetch: PropTypes.func,
};

export default TaskFormAddSub;
