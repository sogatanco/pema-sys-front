import React from 'react';

import PropTypes from 'prop-types';
import './Asset.scss';
import DataTable from 'react-data-table-component';
import { Button } from 'reactstrap';
import user1 from '../../assets/images/users/user1.jpg';

// const baseURL = process.env.REACT_APP_BASEURL;
// gsdgsdgsta
const ListAsset = ({ listAsset, refetch }) => {
  console.log(listAsset);

  setTimeout(() => {
    refetch();
  }, 100000);

  const columns = [
    {
      name: 'Asset Number',
      selector: (row) => row.asset_number,
    },
    {
      name: 'Asset Name',
      selector: (row) => row.name,
    },
    {
      name: 'Amount',
      selector: (row) => row.amount,
    },
    {
      name: 'Responsible',
      selector: (row) => (
        <div className="member">
          {row.responsible_list?.map((m, r) =>
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
      selector: () => (
        <Button color="primary" outline  size="sm">
          {' '}
          Check Detail
        </Button>
      ),
    },

  ];

  return (
    <>
    <DataTable
      columns={columns}
      data={listAsset}
      pagination
    />
      
    </>
  );
};

ListAsset.propTypes = {
  listAsset: PropTypes.array,
  refetch: PropTypes.func,
};
export default ListAsset;
