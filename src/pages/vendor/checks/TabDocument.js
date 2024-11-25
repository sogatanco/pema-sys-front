import React, { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import FileView from '../../../components/fileview/FileView';
import FetchingFile from '../../../components/fetchingFile/FetchingFile';
import previewPdf from '../../../utils/previewPdf';
import { alert } from '../../../components/atoms/Toast';
import CardFrame from '../../../components/cardFrame/CardFrame';

const fileName = [
  {
    key: 'company_profile',
    name: 'File Company Profil',
  },
  {
    key: 'ktp_pengurus',
    name: 'File KTP Pengurus',
  },
  {
    key: 'sk_kemenkumham',
    name: 'File SK Kemenkumham',
  },
  {
    key: 'fakta_integritas',
    name: 'File Fakta Integritas',
  },
  {
    key: 'spt',
    name: 'File SPT 3 Tahun Terakhir',
  },
  {
    key: 'pph',
    name: 'File Laporan Pajak 3 Bulan Terakhir',
  },
  {
    key: 'lap_keuangan',
    name: 'File Laporan Keuangan 3 Tahun Terakhir',
  },
  {
    key: 'rek_koran',
    name: 'File Rekening Koran 3 Bulan Terakhir',
  },
];

const TabDocument = ({ companyId }) => {
  const [akta, setAkta] = useState();
  const [izin, setIzin] = useState();
  const [dokumen, setDokumen] = useState(undefined);
  const [aktaIsLoading, setAktaIsLoading] = useState(false);
  const [izinIsLoading, setIzinIsLoading] = useState(false);
  const [dokumenIsLoading, setDokumenIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

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

  const downloadFile = async (file, filetype, id) => {
    setIsFetching(true);
    setSelectedFileType(filetype);
    setSelectedId(id);
    const splitBySlash = file.split('/');
    const nameFile = splitBySlash[splitBySlash.length - 1];
    await api
      .get(`api/file/preview/${companyId}?type=${filetype}&file=${nameFile}`, {
        responseType: 'arraybuffer',
        onDownloadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percentage = total ? Math.floor((loaded / total) * 100) : null;
          setProgress(percentage);
        },
      })
      .then((res) => {
        setIsFetching(false);
        setProgress(0);
        previewPdf(res.data, nameFile);
      })
      .catch(() => {
        setIsFetching(false);
        alert('error', 'Failed to fetch file');
      });
  };

  return (
    <>
      <CardFrame title="Daftar Akta Perusahaan">
        {aktaIsLoading ? (
          'Loading..'
        ) : akta?.length > 0 ? (
          <Table hover bordered>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} width="50">
                  #
                </th>
                <th style={{ textAlign: 'center' }}>Nomor</th>
                <th style={{ textAlign: 'center' }}>Terbit</th>
                <th style={{ textAlign: 'center' }}>Notaris</th>
                <th style={{ textAlign: 'center' }}>Jenis</th>
                <th style={{ textAlign: 'center' }} width="200">
                  File
                </th>
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
                  <td style={{ textAlign: 'center' }}>
                    {isFetching && selectedFileType === 'akta' && selectedId === ak.id_akta ? (
                      <FetchingFile progress={0} />
                    ) : (
                      <Link to="#">
                        <Button
                          type="button"
                          size="sm"
                          color="light"
                          onClick={() => downloadFile(ak.file_akta, 'akta', ak.id_akta)}
                        >
                          Lihat File Akta
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div>Belum ada data akta</div>
        )}
      </CardFrame>
      <CardFrame title="Daftar Izin Perusahaan">
        {izinIsLoading ? (
          'Loading..'
        ) : izin?.length > 0 ? (
          <Table hover bordered>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} width="50">
                  #
                </th>
                <th style={{ textAlign: 'center' }}>Nomor</th>
                <th style={{ textAlign: 'center' }}>Nama Izin</th>
                <th style={{ textAlign: 'center' }}>Terbit</th>
                <th style={{ textAlign: 'center' }}>Berakhir</th>
                <th style={{ textAlign: 'center' }} width="200">
                  File
                </th>
              </tr>
            </thead>
            <tbody>
              {izin?.map((iz, i) => (
                <tr key={iz.id_izin}>
                  <td>{i + 1}</td>
                  <td>{iz.nomor}</td>
                  <td>{iz.nama_izin}</td>
                  <td style={{ textAlign: 'center' }}>{iz.tgl_terbit}</td>
                  <td style={{ textAlign: 'center' }}>{iz.tgl_berakhir}</td>
                  <td style={{ textAlign: 'center' }}>
                    {isFetching && selectedFileType === 'izin' && selectedId === iz.id_izin ? (
                      <FetchingFile progress={progress} />
                    ) : (
                      <Link to="#">
                        <Button
                          type="button"
                          size="sm"
                          color="light"
                          onClick={() => downloadFile(iz.file_izin, 'izin', iz.id_izin)}
                        >
                          Lihat File Izin
                        </Button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div>Belum ada data izin</div>
        )}
      </CardFrame>
      <CardFrame title="Daftar Dokumen Perusahaan">
        {dokumenIsLoading
          ? 'Loading..'
          : dokumen !== undefined &&
            fileName.map(
              (f) =>
                dokumen[f.key] !== '-' && (
                  <FileView
                    key={f.key}
                    companyId={companyId}
                    mode="preview"
                    file={dokumen !== undefined && dokumen[f.key]}
                    filename={f.name}
                  />
                ),
            )}
      </CardFrame>
    </>
  );
};

TabDocument.propTypes = {
  companyId: PropTypes.string,
};

export default TabDocument;
