import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component';
import { Badge, Button, Input } from 'reactstrap';  
import { alert } from '../../components/atoms/Toast';
import './style.scss';

const ListPengajuan = ({
  submitted,
  updateForm,
  toggleDetail,
  toggleApproval,
  toggleLog,
  value,
  toggleR,
  toggleDoc,
  toggleRe,
  done,
}) => {
  const [search, setSearch] = React.useState('');
  const [listP, setListP] = React.useState([]);
  const [hCol, setHCol] = React.useState(false);
  const [hPro,setHPro]=React.useState(false);

  useEffect(() => {
    setListP(submitted);
    if (value === '3') {
      setHCol(true);
    }
    if(value === '4'){
      setHPro(true);
    }
  }, [submitted, value]);

  useEffect(() => {
    const result = submitted?.filter((p) =>
      p.nama.toLocaleLowerCase().match(search.toLocaleLowerCase()),
    );
    setListP(result);
    console.log(search);
  }, [search]);

 

  const update = (row) => {
    if (row.current_status === 'signed') {
      alert('success', 'Fitur ini dalam proses pengembangan');
    } else {
      updateForm(row);
    }
  };
  const columns = [
    {
      name: 'Actions',
      width: `${value === '1' ? '455px' : '380px'}`,
      selector: (row) => (
        <>
          {value === '1' ? (
            <Button
              className="me-2"
              size="sm"
              outline
              color="danger"
              tag="input"
              type="reset"
              value={row.current_status !== 'signed' ? 'Update' : 'Ekstend'}
              onClick={() => update(row)}
            />
          ) : (
            ''
          )}
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
          {value === '3' ? (
            <Button
              className="me-2"
              size="sm"
              outline
              color="danger"
              tag="input"
              type="reset"
              value="Review"
              onClick={() => toggleR(row)}
            />
          ) : (
            ''
          )}
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

          {value === '4' ? (
            <Button
              className="me-2"
              size="sm"
              outline
              color="info"
              tag="input"
              type="reset"
              value="Process"
              onClick={() => done(row)}
            />
          ) : (
            ''
          )}

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
      name: 'Diajukan sejak',
      selector: (row) =>
        `${new Date(row.created_at).toLocaleDateString('en-us', 'numeric')} ${new Date(
          row.created_at,
        ).toLocaleTimeString()} `,
    },
    {
      name: 'Jenis Proses',
      selector: (row) =>
         (
          <Badge color="info" style={{ width: '100px' }}>
            {row.type_proses}
          </Badge>
        ) ,
        omit:!hPro
    },
    {
      name: 'Jenis Persetujuan',
      selector: (row) => (
        <Badge color="success" style={{ width: '100px' }}>
          {row.current_type}
        </Badge>
      ),
      omit: !hCol,
    },
    {
      name: 'Status Pengajuan',
      selector: (row) =>
        row.current_status === 'signed' ? (
          <Badge color="success" style={{ width: '100px' }}>
            Approved
          </Badge>
        ) : row.current_status === 'rejected' ? (
          <Badge color="danger" style={{ width: '100px' }}>
            Rejected
          </Badge>
        ) : (
          <Badge color="warning" style={{ width: '100px' }}>
            Under Review
          </Badge>
        ),
      omit: hCol,
    },
    
    {
      name: 'Status Realisasi',
      selector: (row) =>
        row.realisasi_status ? (
          <Badge color="info" style={{ width: '100px' }}>
            {row.realisasi_status}
          </Badge>
        ) : (
          <Badge color="dark" style={{ width: '100px' }}>
            Belum Ada
          </Badge>
        ),
    },
  ];

  return (
    <>
      <DataTable
        keyField={value==='4'?'id_unique':'id'}
        columns={columns}
        data={listP}
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
    </>
  );
};
ListPengajuan.propTypes = {
  submitted: PropTypes.array,
  updateForm: PropTypes.func,
  toggleDetail: PropTypes.func,
  toggleApproval: PropTypes.func,
  toggleLog: PropTypes.func,
  value: PropTypes.string,
  toggleR: PropTypes.func,
  toggleDoc: PropTypes.func,
  toggleRe: PropTypes.func,
  done:PropTypes.func
};

export default ListPengajuan;
