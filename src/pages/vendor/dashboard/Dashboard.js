import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { Card, CardBody, Button } from 'reactstrap';
import useAxios from '../../../hooks/useAxios';
import TenderCollapse from './TenderCollapse';

const Dashboard = () => {
  const api = useAxios();

  const { data, refetch } = useQuery({
    queryKey: ['cat'],
    queryFn: () =>
      api.get(`dapi/vendor/tender`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <>
      {data?.reverse().map((d) => (
        <Card className="mb-2 rounded-3" key={d.id_tender}>
          <CardBody>
            <div className="d-flex justify-content-between mb-2">
              <div className="d-flex flex-column">
                <strong>{d.nama_tender}</strong>
                <div className="d-flex gap-2">
                  <small>
                    {' '}
                    Sistem Kualifikasi: <span className="fw-bold">{d.sistem_kualifikasi}</span>
                  </small>{' '}
                  |
                  <small>
                    {' '}
                    Metode: <span className="fw-bold">{d.metode_pengadaan}</span>
                  </small>{' '}
                  |
                  <small>
                    {' '}
                    Status: <span className="fw-bold">{d.status_tender}</span>
                  </small>
                </div>
              </div>
              <div>
                <Button href={`vendor/update-tender/${d.id_tender}`} color="primary" size="sm">
                  Edit Tender
                </Button>
              </div>
            </div>
            <TenderCollapse tender={d} action={refetch} />
          </CardBody>
        </Card>
      ))}
    </>
  );
};

export default Dashboard;
