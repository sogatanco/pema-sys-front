import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalHeader, FormGroup, Label } from 'reactstrap';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import './Asset.scss';
import user1 from '../../assets/images/users/user1.jpg';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

const baseURL = process.env.REACT_APP_BASEURL;

const AssetOnMe = ({ onMe, handleChange, refetch1, refetch2 }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);
  const [sesImg, setSesImg] = useState(new Date());
  const [modal, setModal] = useState(false);
  const [complaint, setComplaint] = useState();
  const [assetId, setAssetId] = useState();

  const api = useAxios();
  const toggle = (id) => {
    setModal(!modal);
    if (!modal) {
      setAssetId(id);
    }
  };
  const columns = [
    {
      name: 'Photo',
      selector: (row) => (
        <img
          className="img-thumbnail img-list mt-1 mb-1"
          alt={row.id}
          src={`${baseURL}inven${row?.file}?s=${sesImg}`}
        />
      ),
    },
    {
      name: 'Asset Number',
      selector: (row) => row.asset_number,
    },
    {
      name: 'Asset Name',
      selector: (row) => row.name,
    },
    {
      name: 'Responsible',
      selector: (row) => (
        <div className="member">
          {row.res_list?.map((m, r) =>
            r < 3 ? (
              <img
                key={m?.employe_id}
                src={m?.img ? m?.img : user1}
                className="rounded-circle"
                alt="avatar"
                width="35"
                height="35"
              />
            ) : (
              <img
                src="https://cdn5.vectorstock.com/i/1000x1000/38/64/color-circle-with-plus-icon-vector-13503864.jpg"
                className="rounded-circle img-pluss"
                alt="avatar"
                width="20"
                height="20"
              />
            ),
          )}
        </div>
      ),
    },
    {
      name: 'Action',
      selector: (row) => (
        <Button
          color="primary"
          outline
          size="sm"
          onClick={() => toggle(row.id)}
          disabled={row.request_service}
        >
          {row.request_service ? 'Service Requested' : 'Request Service'}
        </Button>
      ),
    },
  ];

  const submit = async () => {
    const vadd = { complaint, asset_child: assetId };

    await api
      .post(`dapi/inv/rservice`, vadd)
      .then((res) => {
        if (res?.data?.success) {
          toggle();
          handleChange('', '3');
          alert('success', `Request Submitted succesfully !`);
          refetch2();
          refetch1();
        }
      })
      .catch((err) => {
        toggle();

        alert('error', err);
      });
  };

  useEffect(() => {
    setFilter(onMe);
    setSesImg(new Date());
  }, [onMe]);

  useEffect(() => {
    const result = onMe?.filter((p) =>
      p.name.toLocaleLowerCase().match(search.toLocaleLowerCase()),
    );
    setFilter(result);
  }, [search]);

  return (
    <>
      <DataTable
        columns={columns}
        data={filter}
        pagination
        subHeader
        subHeaderComponent={
          <div className="d-flex justify-content-end w-100">
            <Input
              type="text"
              value={search}
              placeholder="search . . . . "
              className="w-25"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
      />

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Request Service Form</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="in_location">Your Complaint</Label>
            <Input
              id="in_location"
              name="in_location"
              type="textarea"
              onChange={(e) => setComplaint(e.target.value)}
              value={complaint}
            />
          </FormGroup>
          <FormGroup>
            <div className="d-grid gap-2 mt-4">
              <Button type="submit" onClick={submit}>
                Save Data
              </Button>
            </div>
          </FormGroup>
        </ModalBody>
      </Modal>
    </>
  );
};

AssetOnMe.propTypes = {
  onMe: PropTypes.array,
  handleChange: PropTypes.func,
  refetch1: PropTypes.func,
  refetch2:PropTypes.func
};

export default AssetOnMe;
