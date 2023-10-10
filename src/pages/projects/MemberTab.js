import React from 'react';
import { Card, CardBody, Col, Table } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';

const MemberTab = () => {
  const api = useAxios();

  const { projectId } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ['members'],
    queryFn: () =>
      api.get(`api/project/${projectId}/members`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <Col>
      <Card>
        <CardBody>
          {isLoading ? (
            'Loading...'
          ) : error ? (
            'Something went wrong.'
          ) : data?.length > 0 ? (
            <Table className="no-wrap mt-3 align-middle" hover style={{ zIndex: '-1' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Division</th>
                </tr>
              </thead>
              <tbody style={{ overflow: 'hidden' }}>
                {data?.map((m, i) => (
                  <tr key={m.first_name}>
                    <td>{i + 1}</td>
                    <td>{m.first_name}</td>
                    <td>{m.position_name}</td>
                    <td>{m.organization_name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="d-flex justify-content-center">
              <h6>No data yet.</h6>
            </div>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default MemberTab;
