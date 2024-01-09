import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card, CardBody, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import BreadCrumbs from '../../../layouts/breadcrumbs/BreadCrumbs';
import rupiah from '../../../utils/rupiah';

const Dashboard = () => {
  const api = useAxios();

  const { data } = useQuery({
    queryKey: ['cat'],
    queryFn: () =>
      api.get(`dapi/vendor/tender`).then((res) => {
        return res.data.data;
      }),
  });
  console.log(data);
  return (
    <>
      <BreadCrumbs />
      {data?.map((d) => (
        <div key={d.id_tender}>
          <Card className="mb-2">
            <CardBody>
              <strong>{d.nama_tender}</strong>
              <Link to={`update-tender/${d.id_tender}`}>Update</Link>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Row>
                <Col md="6">
                  <table width="100%">
                    <tbody>
                      <tr>
                        <td>Lokasi Pengerjaan</td>
                        <td>:</td>
                        <td>{d.lokasi}</td>
                      </tr>
                      <tr>
                        <td>Waktu Pendaftaran</td>
                        <td>:</td>
                        <td>
                          {d.tgl_pendaftaran} s/d {d.batas_pendaftaran}
                        </td>
                      </tr>
                      <tr>
                        <td>Jenis Pengadaan</td>
                        <td>:</td>
                        <td>{d.jenis_pengadaan}</td>
                      </tr>
                      <tr>
                        <td>HPS</td>
                        <td>:</td>
                        <td>{rupiah(d.hps)}</td>
                      </tr>
                      <tr>
                        <td>Nomor KBLI</td>
                        <td>:</td>
                        <td>{d.kbli}</td>
                      </tr>
                      <tr>
                        <td>Sistem Kualifikasi</td>
                        <td>:</td>
                        <td>{d.sistem_kualifikasi}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md="6">sdgsdg</Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      ))}
    </>
  );
};

export default Dashboard;
