import React from 'react';
import { Card, CardBody, Col, Table } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import newDate from '../../utils/formatDate';

const FileTab = () => {
  const { projectId } = useParams();

  const api = useAxios();

  const fileUrl = process.env.REACT_APP_BASEURL_DEV;

  const { isLoading, error, data } = useQuery({
    queryKey: ['files'],
    queryFn: () =>
      api.get(`api/project/${projectId}/files`).then((res) => {
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
          ) : (
            <Table className="no-wrap mt-3 align-middle" hover style={{ zIndex: '-1' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Filename</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody style={{ overflow: 'hidden' }}>
                {data?.map((f, i) => (
                  <tr key={f.file_id}>
                    <td>{i + 1}</td>
                    <td>
                      <Link to={`${fileUrl}taskfiles/${f.file_name}`} target="blank">
                        {f.file_name}
                      </Link>
                    </td>
                    <td>{newDate(f.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default FileTab;
