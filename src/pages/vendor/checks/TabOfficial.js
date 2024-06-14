import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Table } from 'reactstrap';
import PropTypes from 'prop-types';
import useAxios from '../../../hooks/useAxios';
import FileView from '../../../components/fileview/FileView';

const TabOfficial = ({ companyId }) => {
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['official-list'],
    queryFn: () =>
      api.get(`dapi/vendor/${companyId}/list-jajaran`).then((res) => {
        return res.data.data;
      }),
  });

  return isLoading ? (
    'Loading..'
  ) : error ? (
    'Something went wrong.'
  ) : (
    <>
      <Table hover bordered>
        <thead>
          <tr>
            <th width="50">#</th>
            <th className="text-center">Nama</th>
            <th className="text-center">Jabatan</th>
            <th className="text-center">NPWP</th>
          </tr>
        </thead>
        <tbody>
          {data?.jajaran?.length > 0 ? (
            data?.jajaran.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.nama}</td>
                <td>{item.jabatan}</td>
                <td>{item.no_npwp_direksi}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center">
                Belum ada data jajaran
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {data?.struktur_base64 !== null && (
        <FileView
          filename="File Struktur dan NPWP Jajaran Direksi/Komisaris Perusahaan"
          base64={data?.struktur_base64}
          mode="preview"
        />
      )}
    </>
  );
};

TabOfficial.propTypes = {
  companyId: PropTypes.string,
};

export default TabOfficial;
