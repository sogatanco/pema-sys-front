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
  const [aktaIsLoading, setAktaIsLoading] = useState(false);
  const [izinIsLoading, setIzinIsLoading] = useState(false);
  const [dokumenIsLoading, setDokumenIsLoading] = useState(false);

  const api = useAxios();

  useEffect(() => {
    async function fetchAkta() {
      setAktaIsLoading(true);
      await api.get(`dapi/vendor/${companyId}/list-akta`).then((res) => {
        setAkta(res.data.data);
        setAktaIsLoading(false);
      });
    }

    async function fetchIzin() {
      setIzinIsLoading(true);
      await api.get(`dapi/vendor/${companyId}/list-izin`).then((res) => {
        setIzin(res.data.data);
        setIzinIsLoading(false);
      });
    }

    async function fetchDokumen() {
      setDokumenIsLoading(true);
      await api.get(`dapi/vendor/${companyId}/list-dokumen`).then((res) => {
        setDokumen(res.data.data);
        setDokumenIsLoading(false);
      });
    }

    fetchAkta();
    fetchIzin();
    fetchDokumen();
  }, []);

  return (
    <>
      <Col>
        <h4>Akta Perusahaan</h4>
        {aktaIsLoading ? (
          'Loading..'
        ) : akta?.length > 0 ? (
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
          <div>Belum ada data akta</div>
        )}
      </Col>
      <Col className="mt-4">
        <h4>Izin Perusahaan</h4>
        {izinIsLoading ? (
          'Loading..'
        ) : izin?.length > 0 ? (
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
                      to={`data:application/pdf;base64, ${iz.file_base64}`}
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
          <div>Belum ada data izin</div>
        )}
      </Col>
      <Col sm="12" md="8" className="mt-4">
        <h4>Dokumen Perusahaan</h4>
        {dokumenIsLoading ? (
          'Loading..'
        ) : dokumen?.length > 0 ? (
          dokumen.map((dok, i) => (
            <FileView filename={fileName[i]} mode="preview" base64={dok.base_64} key={dok.name} />
          ))
        ) : (
          <div>Belum ada data dokumen</div>
        )}
      </Col>
    </>
  );
};

TabDocument.propTypes = {
  companyId: PropTypes.string,
};

export default TabDocument;
