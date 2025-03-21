import React from 'react';
import DataTable from 'react-data-table-component';

// Sample data
const data = [
  {
    namaKaryawan: 'John Doe',
    keperluan: 'Meeting with clients',
    dari: '2023-10-01T09:00:00',
    sampai: '2023-10-01T12:00:00',
    perluSopir: true,
  },
  {
    namaKaryawan: 'Jane Smith',
    keperluan: 'Site visit',
    dari: '2023-10-02T10:00:00',
    sampai: '2023-10-02T14:00:00',
    perluSopir: false,
  },
  {
    namaKaryawan: 'Alice Johnson',
    keperluan: 'Company retreat',
    dari: '2023-10-03T08:00:00',
    sampai: '2023-10-03T18:00:00',
    perluSopir: true,
  },
  {
    namaKaryawan: 'Bob Brown',
    keperluan: 'Training session',
    dari: '2023-10-04T09:30:00',
    sampai: '2023-10-04T12:30:00',
    perluSopir: false,
  },
  {
    namaKaryawan: 'Charlie Davis',
    keperluan: 'Product launch',
    dari: '2023-10-05T11:00:00',
    sampai: '2023-10-05T15:00:00',
    perluSopir: true,
  },
];

// Define the columns
const columns = [
  {
    name: 'Nama Karyawan',
    selector: row => row.namaKaryawan,
    sortable: true,
  },
  {
    name: 'Keperluan',
    selector: row => row.keperluan,
    sortable: true,
  },
  {
    name: 'Dari',
    selector: row => new Date(row.dari).toLocaleString(),
    sortable: true,
  },
  {
    name: 'Sampai',
    selector: row => new Date(row.sampai).toLocaleString(),
    sortable: true,
  },
  {
    name: 'Perlu Sopir',
    selector: row => (row.perluSopir ? 'Ya' : 'Tidak'),
    sortable: true,
  },
];

const ListPermintaan = () => {
  return (
    <DataTable
      title="List Permintaan Kendaraan"
      columns={columns}
      data={data}
      pagination
      highlightOnHover
      striped
    />
  );
};

export default ListPermintaan;
