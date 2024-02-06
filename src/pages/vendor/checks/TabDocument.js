import React, { useEffect, useState } from 'react';
import { Button, Col, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import FileView from '../../../components/fileview/FileView';

const fileName = [
  'File Company Profil',
  'File KTP Pengurus',
  'File SK Kemenkumham',
  'File Fakta Integritas',
  'File SPT 3 Tahun Terakhir',
  'File Laporan Pajak 3 Bulan Terakhir',
  'File Laporan Keuangan 3 Tahun Terakhir',
  'File Rekening Koran 3 Bulan Terakhir',
];

const TabDocument = ({ companyId }) => {
  const [akta, setAkta] = useState();
  const [izin, setIzin] = useState();
  const [dokumen, setDokumen] = useState();

  const api = useAxios();

  useEffect(() => {
    async function fetchAkta() {
      await api.get(`dapi/vendor/${companyId}/list-akta`).then((res) => setAkta(res.data.data));
    }

    async function fetchIzin() {
      await api.get(`dapi/vendor/${companyId}/list-izin`).then((res) => setIzin(res.data.data));
    }

    async function fetchDokumen() {
      await api
        .get(`dapi/vendor/${companyId}/list-dokumen`)
        .then((res) => setDokumen(res.data.data));
    }

    fetchAkta();
    fetchIzin();
    fetchDokumen();
  }, []);

  return (
    <>
      <Col>
        <h4>Akta Perusahaan</h4>
        {akta?.length > 0 ? (
          <Table hover bordered>
            <thead>
              <tr>
                <th width="50">#</th>
                <th>Nomor</th>
                <th>Terbit</th>
                <th>Notaris</th>
                <th>Jenis</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {akta?.map((ak, i) => (
                <tr key={ak.id_akta}>
                  <td>{i + 1}</td>
                  <td>{ak.no_akta}</td>
                  <td>{ak.tgl_terbit}</td>
                  <td>{ak.nama_notaris}</td>
                  <td>{ak.jenis}</td>
                  <td>
                    <Link
                      to={`data:application/pdf;base64, ${ak.file_base64}`}
                      download={`akta_${ak.no_akta}.pdf`}
                    >
                      <Button type="button" size="sm" color="light">
                        Download
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          'Loading..'
        )}
      </Col>
      <Col className="mt-4">
        <h4>Izin Perusahaan</h4>
        {izin?.length > 0 ? (
          <Table hover bordered>
            <thead>
              <tr>
                <th width="50">#</th>
                <th>Nomor</th>
                <th>Izin</th>
                <th>Terbit</th>
                <th>Berakhir</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {izin?.map((iz, i) => (
                <tr key={iz.id_izin}>
                  <td>{i + 1}</td>
                  <td>{iz.nomor}</td>
                  <td>{iz.nama_izin}</td>
                  <td>{iz.tgl_terbit}</td>
                  <td>{iz.tgl_berakhir}</td>
                  <td>
                    <Link
                      to={`data:application/pdf;base64, ${iz.nomor}`}
                      download={`izin_berusaha_${iz.nomor}.pdf`}
                    >
                      <Button type="button" size="sm" color="light">
                        Download
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          'Loading..'
        )}
      </Col>
      {dokumen?.length > 0
        ? dokumen.map((dok, i) => (
            <Col sm="12" md="8" key={dok.name} className="mt-4">
              <FileView filename={fileName[i]} mode="preview" base64={dok.base_64} />
            </Col>
          ))
        : ''}
    </>
  );
};

TabDocument.propTypes = {
  companyId: PropTypes.string,
};

export default TabDocument;
