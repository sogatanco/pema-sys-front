import React, { useState } from 'react';
import { Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../hooks/useAxios';
import rupiah from '../../../utils/rupiah';
import FetchingFile from '../../../components/fetchingFile/FetchingFile';
import previewPdf from '../../../utils/previewPdf';
import { alert } from '../../../components/atoms/Toast';
import CardFrame from '../../../components/cardFrame/CardFrame';

const TabPortfolio = ({ companyId }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFileType, setSelectedFileType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['portofolio-list'],
    queryFn: () =>
      api.get(`dapi/vendor/${companyId}/list-portofolio`).then((res) => {
        return res.data.data;
      }),
  });

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
    <CardFrame title="Daftar Portofolio Perusahaan">
      {isLoading ? (
        'Loading..'
      ) : error ? (
        'Something went wrong.'
      ) : data?.length > 0 ? (
        <Table hover bordered>
          <thead>
            <tr>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }} width="50">
                #
              </th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Nama Projek</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Tahun Mulai</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Tahun Selesai</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Durasi (Bulan)</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Owner</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }}>Nilai PO</th>
              <th style={{ verticalAlign: 'middle', textAlign: 'center' }} width="180">
                SPK
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((pr, i) => (
              <tr key={pr.id_porto}>
                <td>{i + 1}</td>
                <td>{pr.nama_project}</td>
                <td>{pr.tahun_mulai}</td>
                <td>{pr.tahun_selesai}</td>
                <td>{pr.durasi}</td>
                <td>{pr.owner}</td>
                <td>{rupiah(pr.nilai_po)}</td>
                <td style={{ textAlign: 'center' }}>
                  {isFetching && selectedFileType === 'spk_porto' && selectedId === pr.id_porto ? (
                    <FetchingFile progress={progress} />
                  ) : (
                    <Link to="#">
                      <Button
                        type="button"
                        size="sm"
                        color="light"
                        onClick={() => downloadFile(pr.spk, 'spk_porto', pr.id_porto)}
                      >
                        Lihat File SPK
                      </Button>
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        'Belum ada data.'
      )}
    </CardFrame>
  );
};

TabPortfolio.propTypes = {
  companyId: PropTypes.string,
};

export default TabPortfolio;
