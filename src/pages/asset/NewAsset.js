import React, { useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Button, Modal, ModalHeader, ModalBody, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const animatedComponents = makeAnimated();

const NewAsset = ({ categories, employees }) => {
  const { auth } = useAuth();
  const [modal, setModal] = useState(false);

  const [inName, setInName] = useState('');
  const [inType, setInType] = useState('');
  const [inPrice, setInPrice] = useState('');
  const [inCurrent, setInCurrent] = useState('');
  const [inLocation, setInLocation] = useState('');
  const [inAmount, setInAmount] = useState('');
  const [inImage, setInImage] = useState('');
  const [inVendor, setInVendor] = useState('');
  const [inAcquisition, setInAcquisition] = useState('');
  const [assignedEmployees, setAssignedEmployees] = useState([]);

  const toggle = () => {
    setModal(!modal);
  };

  const saveData = () => {
    const assigne = [];
    assignedEmployees.map((r) => assigne.push(`//${r.value}//`));
    console.log(assigne.toLocaleString());
    console.log(inPrice);
    console.log(inName);
    console.log(inCurrent);
    console.log(inAmount);
    console.log(inAcquisition);
    console.log(inImage);
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = '';
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const handleFileChange = (e) => {
    getBase64(e.target.files[0])
      .then((result) => {
        setInImage(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeAssign = (choice) => {
    setAssignedEmployees(choice);
  };

  return (
    <>
      {auth?.user.roles.includes('PicAsset') ? (
        <Button color="dark" onClick={toggle}>
          New Inventory
        </Button>
      ) : (
        ''
      )}

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>New Inventory Data</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="in_name">Inventory Name</Label>
            <Input
              id="in_name"
              name="in_name"
              type="text"
              onChange={(e) => setInName(e.target.value)}
              value={inName}
            />
          </FormGroup>

          <FormGroup>
            <Label for="typeselect">Inventory Type</Label>
            <Input
              id="typeselect"
              name="select"
              type="select"
              value={inType}
              onChange={(e) => setInType(e.target.value)}
            >
              <option>Choose Type</option>
              {categories?.map((c) => (
                <option key={c?.id} value={c?.code}>
                  {c?.name}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="in_harga_beli">Purchase Price</Label>
            <Input
              id="in_harga_beli"
              name="in_harga_beli"
              type="text"
              onChange={(e) => setInPrice(e.target.value)}
              value={inPrice}
            />
          </FormGroup>

          <FormGroup>
            <Label for="in_vendor">
              Vendor <small>(optional)</small>
            </Label>
            <Input
              id="in_vendor"
              name="in_vendor"
              type="text"
              onChange={(e) => setInVendor(e.target.value)}
              value={inVendor}
            />
          </FormGroup>

          <FormGroup>
            <Label for="in_harga_sekarang">Current Price</Label>
            <Input
              id="in_harga_sekarang"
              name="in_harga_sekarang"
              type="text"
              onChange={(e) => setInCurrent(e.target.value)}
              value={inCurrent}
            />
          </FormGroup>

          <FormGroup>
            <Label for="time">Acquisition Time</Label>
            <Input
              id="time"
              name="date"
              placeholder="date placeholder"
              type="date"
              onChange={(e) => setInAcquisition(e.target.value)}
              value={inAcquisition}
            />
          </FormGroup>

          <FormGroup>
            <Label for="in_amount">Amount</Label>
            <Input
              id="in_amount"
              name="in_amount"
              type="text"
              onChange={(e) => setInAmount(e.target.value)}
              value={inAmount}
            />
          </FormGroup>

          <FormGroup>
            <Label for="file">Inventory Image</Label>
            <Input id="file" name="file" type="file" onChange={(e) => handleFileChange(e)} accept="image/*" />
          </FormGroup>

          <FormGroup>
            <Label for="in_location">Detail Location</Label>
            <Input
              id="in_location"
              name="in_location"
              type="textarea"
              onChange={(e) => setInLocation(e.target.value)}
              value={inLocation}
            />
          </FormGroup>

          <FormGroup>
            <Label for="in_harga_beli">Responsible</Label>
            <Select
              // closeMenuOnSelect={true}
              components={animatedComponents}
              isMulti
              value={assignedEmployees}
              options={employees}
              onChange={changeAssign}
              //   isClearable={assignedEmployees.some((v) => !v.isFixed)}
            />
          </FormGroup>

          <FormGroup>
            <div className="d-grid gap-2 mt-4">
              <Button onClick={() => saveData()}>Save Data</Button>
            </div>
          </FormGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

NewAsset.propTypes = {
  categories: PropTypes.array,
  employees: PropTypes.array,
};

export default NewAsset;
