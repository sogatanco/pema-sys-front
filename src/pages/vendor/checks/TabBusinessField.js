import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'reactstrap';
import useAxios from '../../../hooks/useAxios';

const TabBusinessField = ({ companyId }) => {
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['kbli-list'],
    queryFn: () =>
      api.get(`dapi/vendor/${companyId}/list-kbli`).then((res) => {
        return res.data.data;
      }),
  });

  return isLoading ? (
    'Loading..'
  ) : error ? (
    'Something went wrong.'
  ) : data?.length > 0 ? (
    <Table hover bordered>
      <thead>
        <tr>
          <th width="50">#</th>
          <th>NIB</th>
          <th>Nama Bidang Usaha</th>
          <th>Resiko</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((kb, i) => (
          <tr key={kb.id_kbli}>
            <td>{i + 1}</td>
            <td>{kb.nomor_kbli}</td>
            <td>{kb.nama_kbli}</td>
            <td>{kb.resiko}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    'Belum ada data.'
  );
};

TabBusinessField.propTypes = {
  companyId: PropTypes.string,
};

export default TabBusinessField;
