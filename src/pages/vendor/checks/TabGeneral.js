import { useQuery } from '@tanstack/react-query';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import useAxios from '../../../hooks/useAxios';

const TabGeneral = ({ companyId }) => {
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['general-list'],
    queryFn: () =>
      api.get(`dapi/vendor/${companyId}/list-data-umum`).then((res) => {
        return res.data.data;
      }),
  });

  return isLoading ? (
    'Loading..'
  ) : error ? (
    'Something went wrong.'
  ) : (
    <table className="w-100">
      <tbody>
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
          <td width="300">Bentuk Perusahaan</td>
          <td className="fw-bold">{data.bentuk_usaha}</td>
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
            <Button type="button" size="sm" color="light">
              Preview file NPWP
            </Button>
          </td>
        </tr>
        <tr>
          <td width="300">Bidang Usaha</td>
          <td className="fw-bold"> - </td>
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
            <Button type="button" size="sm" color="light">
              Preview file PVD
            </Button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

TabGeneral.propTypes = {
  companyId: PropTypes.string,
};

export default TabGeneral;
