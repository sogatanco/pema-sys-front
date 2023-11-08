import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import TicketTable from './TicketTable';
import useAxios from '../../hooks/useAxios';

const RequestsList = () => {
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['requestlist'],
    queryFn: () =>
      // api.get(`api/task/${auth?.user.employe_id}/recent/activity`).then((res) => {
      api.get(`api/ticket/manager`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <>
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <Col className="d-flex justify-content-between" col="12">
                <div className="">
                  <CardTitle tag="h5" className="fw-bold">
                    Requests Listing
                  </CardTitle>
                </div>
              </Col>
              {isLoading ? (
                'Loading...'
              ) : error ? (
                'Something went wrong.'
              ) : data.length > 0 ? (
                <TicketTable {...{ data }} tab="requests" />
              ) : (
                <div className="d-flex justify-content-center">No data yet.</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RequestsList;
