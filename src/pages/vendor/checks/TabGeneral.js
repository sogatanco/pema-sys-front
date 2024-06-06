import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';

const TabGeneral = ({ companyId, setSelectedName }) => {
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

  console.log(data);

  return isLoading ? (
    'Loading..'
  ) : error ? (
    'Something went wrong.'
  ) : (
    <Table className="w-100">
      <tbody>
        <tr>
          <td width="300">Bentuk Perusahaan</td>
          <td className="fw-bold">{data.bentuk_usaha}</td>
        </tr>
        <tr>
          <td width="300">Nama Perusahaan</td>
          <td className="fw-bold">{data.nama_perusahaan}</td>
        </tr>
        <tr>
          <td width="300">Unique ID</td>
          <td className="fw-bold">{data.nomor_registrasi}</td>
        </tr>
        <tr>
          <td width="300">Tipe Penyedia</td>
          <td className="fw-bold">{data.tipe}</td>
        </tr>
        <tr>
          <td width="300">Email Perusahaan</td>
          <td className="fw-bold">{data.email}</td>
        </tr>
        <tr>
          <td width="300">NPWP</td>
          <td className="fw-bold">{data.no_npwp}</td>
        </tr>
        <tr>
          <td width="300">File NPWP</td>
          <td className="fw-bold">
            <Link to={`data:application/pdf;base64, ${data?.base64_npwp}`} download="npwp.pdf">
              <Button type="button" size="sm" color="light">
                Download File NPWP
              </Button>
            </Link>
          </td>
        </tr>
        <tr>
          <td width="300">Kontak</td>
          <td className="fw-bold">{data.hp}</td>
        </tr>
        <tr>
          <td width="300">Alamat</td>
          <td className="fw-bold">{data.alamat}</td>
        </tr>
        <tr>
          <td width="300">Provinsi</td>
          <td className="fw-bold">{data.provinsi}</td>
        </tr>
        <tr>
          <td width="300">File PVD</td>
          <td className="fw-bold">
            <Link to={`data:application/pdf;base64, ${data?.base64_pvd}`} download="pvd.pdf">
              <Button type="button" size="sm" color="light">
                Download File PVD
              </Button>
            </Link>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

TabGeneral.propTypes = {
  companyId: PropTypes.string,
  setSelectedName: PropTypes.func,
};

export default TabGeneral;
