import React, { useEffect, useState } from 'react';
// import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';

import { Card, CardBody, Input, Button } from 'reactstrap';

const CompanyList = ({ companies }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState([]);

  const columns = [
    {
      name: 'Company Name',
      selector: (row) => `${row.bentuk_usaha} ${row.nama_perusahaan}`,
    },
    {
      name: 'Company Email',
      selector: (row) => row.email,
    },
    {
      name: 'Type of Business',
      selector: (row) => row.tipe || '-',
    },
    {
      name: 'Address',
      selector: (row) => row.alamat || '-',
    },
    {
      name: 'Phone Number',
      selector: (row) => row.telepon || '-',
    },
    {
      name: 'Action',
      selector: (row) => row.nama_perusahaan,
    },
  ];

  const handleChange = ({ selectedRows }) => {
    console.log(selectedRows);
  };

  const viewAs = (e) => {
    if (e.target.value === 'all') {
      setFilter(companies);
    } else {
      setFilter(companies.filter((p) => p.status_verifikasi === e.target.value));
    }
    console.log(e.target.value);
  };

  useEffect(() => {
    setFilter(companies);
  }, [companies]);

  useEffect(() => {
    const result = companies?.filter((p) =>
      p.nama_perusahaan.toLocaleLowerCase().match(search.toLocaleLowerCase()),
    );
    setFilter(result);
  }, [search]);

  return (
    <>
      <Card>
        <CardBody>
          <DataTable
            columns={columns}
            data={filter}
            pagination
            selectableRows
            onSelectedRowsChange={handleChange}
            subHeader
            subHeaderComponent={
              <div className="d-flex justify-content-between w-100">
                <div>
                  <Button color="danger" size="sm">
                    <i className="bi bi-trash3"></i> Delete
                  </Button>{' '}
                  <Button color="success" size="sm">
                    <i className="bi bi-cloud-arrow-down"></i> Export
                  </Button>
                </div>
                <div>
                  <Input bsSize="sm" type="select" onChange={(e) => viewAs(e)}>
                    <option value="all">All</option>
                    <option value="register">Register</option>
                    <option value="review">Review</option>
                    <option value="terverifikasi">Terverifikasi</option>
                    <option value="revisi">Revisi</option>
                  </Input>
                </div>
                <Input
                  bsSize="sm"
                  type="text"
                  value={search}
                  placeholder="search . . . . "
                  className="w-25"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            }
          />
        </CardBody>
      </Card>
    </>
  );
};

CompanyList.propTypes = {
  companies: PropTypes.array,
};
export default CompanyList;
