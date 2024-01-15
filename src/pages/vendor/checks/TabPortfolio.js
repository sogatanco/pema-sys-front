import React from 'react';
import { Button, Table } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../hooks/useAxios';

const TabPortfolio = ({ companyId }) => {
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['portofolio-list'],
    queryFn: () =>
      api.get(`dapi/vendor/${companyId}/list-portofolio`).then((res) => {
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
          <th>Nama Projek</th>
          <th>Tahun Mulai</th>
          <th>Tahun Selesai</th>
          <th>Durasi</th>
          <th>Owner</th>
          <th>Nilai PO</th>
          <th>SPK</th>
        </tr>
      </thead>
      <tbody>
        {data.map((pr, i) => (
          <tr key={pr.id_porto}>
            <td>{i + 1}</td>
            <td>{pr.nama_project}</td>
            <td>{pr.tahun_mulai}</td>
            <td>{pr.tahun_selesai}</td>
            <td>{pr.durasi}</td>
            <td>{pr.owner}</td>
            <td>{pr.nilai_po}</td>
            <td>
              <Link to={`/preview?data=general&doc=${pr.base64}`} target="_blank">
                <Button type="button" size="sm" color="light">
                  Preview
                </Button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    'Belum ada data.'
  );
};

TabPortfolio.propTypes = {
  companyId: PropTypes.string,
};

export default TabPortfolio;
