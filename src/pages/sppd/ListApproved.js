import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { Badge, Button, Input } from 'reactstrap';
import { alert } from '../../components/atoms/Toast';
import './style.scss';

const ListApproved = ({
  approved,
  toggleDetail,
  toggleApproval,
  toggleLog,
  value,
  toggleDoc,
  toggleRe,
}) => {
  const [search, setSearch] = React.useState('');
  const [listP, setListP] = React.useState([]);
  const [hCol, setHCol] = React.useState(false);

  useEffect(() => {
    setListP(approved);
    if (value === '3') {
      setHCol(true);
    }
  }, [approved, value]);

  useEffect(() => {
    const result = approved?.filter((p) =>
      p.nama.toLocaleLowerCase().match(search.toLocaleLowerCase()),
    );
    setListP(result);
    console.log(search);
  }, [search]);

  const columns = [
    {
      name: 'Actions',
      width: `${value === '1' ? '455px' : '370px'}`,
      selector: (row) => (
        <>
          <Button
            size="sm"
            className="me-2"
            outline
            color="dark"
            tag="input"
            type="reset"
            value="Detail"
            onClick={() => toggleDetail(row)}
          />

          <Button
            className="me-2"
            size="sm"
            outline
            color="success"
            tag="input"
            type="reset"
            value="Approval"
            onClick={() => toggleApproval(row)}
          />
          <Button
            className="me-2"
            size="sm"
            outline
            color="primary"
            tag="input"
            type="reset"
            value="Logs"
            onClick={() => toggleLog(row)}
          />
          <Button
            className="me-2"
            size="sm"
            outline
            color="warning"
            tag="input"
            type="reset"
            value="Docs"
            onClick={() => toggleDoc(row)}
          />

          
          {value === '1' ? (
            <Button
              className="me-2"
              size="sm"
              outline
              color="warning"
              tag="input"
              type="reset"
              value="Realisasi"
              onClick={() => {
                if (row.current_status === 'signed') {
                  toggleRe(row);
                } else {
                  alert('error', 'Realisasi hanya bisa dilakukan pada status approved');
                }
              }}
            />
          ) : (
            ''
          )}
        </>
      ),
    },
    {
      name: 'Nomor ST',
      selector: (row) => row.nomor_sppd,
    },
    {
      name: 'Nama',
      selector: (row) => row.nama,
    },
    {
      name: 'Jabatan',
      selector: (row) => row.jabatan,
    },

    {
      name: 'Disetujui pada',
      selector: (row) =>
        `${new Date(row.created_at).toLocaleDateString('en-us', 'numeric')} ${new Date(
          row.approved_at,
        ).toLocaleTimeString()} `,
    },
    {
      name: 'Jenis Persetujuan',
      selector: (row) => (
        <Badge color="success" style={{ width: '100px' }}>
          {row.type}
        </Badge>
      ),
      omit: !hCol,
    },
  ];

  return (
    <>
      <DataTable
        keyField="id_unique"
        columns={columns}
        data={listP}
        pagination
        subHeader
        subHeaderComponent={
          <div className="d-flex justify-content-between w-100">
            <h5 className="mb-0">Pengajuan yang Telah Saya Setujui</h5>
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
    </>
  );
};
ListApproved.propTypes = {
  approved: PropTypes.array,
  toggleDetail: PropTypes.func,
  toggleApproval: PropTypes.func,
  toggleLog: PropTypes.func,
  value: PropTypes.string,
  toggleDoc: PropTypes.func,
  toggleRe: PropTypes.func,
};
export default ListApproved;
