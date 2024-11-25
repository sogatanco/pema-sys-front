import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import previewPdf from '../../../utils/previewPdf';
import FetchingFile from '../../../components/fetchingFile/FetchingFile';
import { alert } from '../../../components/atoms/Toast';
import CardFrame from '../../../components/cardFrame/CardFrame';

const TabGeneral = ({ companyId, setSelectedName }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['general-list'],
    queryFn: () =>
      api.get(`dapi/vendor/${companyId}/list-data-umum`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    setSelectedName(data?.nama_perusahaan);
  }, [data]);

  const downloadFile = async (file, filetype) => {
    setIsFetching(true);
    setSelectedFileType(filetype);
    const splitBySlash = file.split('/');
    const fileName = splitBySlash[splitBySlash.length - 1];
    await api
      .get(`api/file/preview/${companyId}?type=null&file=${fileName}`, {
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
        previewPdf(res.data, fileName);
      })
      .catch(() => {
        setIsFetching(false);
        alert('error', 'Failed to fetch file');
      });
  };

  return (
    <CardFrame title="Data Umum">
      {isLoading ? (
        'Loading..'
      ) : error ? (
        'Something went wrong.'
      ) : (
        <Table className="w-100">
          <tbody>
            <tr>
              <td width="300">Bentuk Perusahaan</td>
              <td width="8">:</td>
              <td className="fw-bold">{data.bentuk_usaha}</td>
            </tr>
            <tr>
              <td width="300">Nama Perusahaan</td>
              <td>:</td>
              <td className="fw-bold">{data.nama_perusahaan}</td>
            </tr>
            <tr>
              <td width="300">Unique ID</td>
              <td>:</td>
              <td className="fw-bold">{data.nomor_registrasi}</td>
            </tr>
            <tr>
              <td width="300">Tipe Penyedia</td>
              <td>:</td>
              <td className="fw-bold">{data.tipe}</td>
            </tr>
            <tr>
              <td width="300">Email Perusahaan</td>
              <td>:</td>
              <td className="fw-bold">{data.email}</td>
            </tr>
            <tr>
              <td width="300">NPWP</td>
              <td>:</td>
              <td className="fw-bold">{data.no_npwp}</td>
            </tr>
            <tr>
              <td width="300">File NPWP</td>
              <td>:</td>
              <td className="fw-bold">
                {isFetching && selectedFileType === 'npwp' ? (
                  <FetchingFile progress={progress} />
                ) : (
                  <Link to="#">
                    <Button
                      type="button"
                      size="sm"
                      color="light"
                      onClick={() => downloadFile(data?.file_npwp, 'npwp')}
                    >
                      Lihat File NPWP
                    </Button>
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <td width="300">Kontak</td>
              <td>:</td>
              <td className="fw-bold">{data.hp}</td>
            </tr>
            <tr>
              <td width="300">Alamat</td>
              <td>:</td>
              <td className="fw-bold">{data.alamat}</td>
            </tr>
            <tr>
              <td width="300">Provinsi</td>
              <td>:</td>
              <td className="fw-bold">{data.provinsi}</td>
            </tr>
            <tr>
              <td width="300">File PVD</td>
              <td>:</td>
              <td className="fw-bold">
                {isFetching && selectedFileType === 'pvd' ? (
                  <FetchingFile progress={progress} />
                ) : (
                  <Link to="#">
                    <Button
                      type="button"
                      size="sm"
                      color="light"
                      onClick={() => downloadFile(data?.file_pvd, 'pvd')}
                    >
                      Lihat File PVD
                    </Button>
                  </Link>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      )}
    </CardFrame>
  );
};

TabGeneral.propTypes = {
  companyId: PropTypes.string,
  setSelectedName: PropTypes.func,
};

export default TabGeneral;
