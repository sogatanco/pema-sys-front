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
      <Table hover>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Jabatan</th>
          </tr>
        </thead>
        <tbody>
          {data?.jajaran.map((item, i) => (
            <tr key={item.id}>
              <td>{i + 1}</td>
              <td>{item.nama}</td>
              <td>{item.jabatan}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <FileView filename="File struktur dan NPWP jajaran Direksi/Komisaris Perusahaan" />
    </>
  );
};

TabOfficial.propTypes = {
  companyId: PropTypes.string,
};

export default TabOfficial;
