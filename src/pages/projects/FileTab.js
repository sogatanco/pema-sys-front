import React, { useEffect } from 'react';
import { Card, CardBody, Table } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import newDate from '../../utils/formatDate';

const sortFileByDate = (arr) => {
  return arr.sort(({ created_at: a }, { created_at: b }) => (a < b ? -1 : a > b ? 1 : 0));
};

const FileTab = () => {
  const { projectId } = useParams();

  const api = useAxios();

  const fileUrl = process.env.REACT_APP_BASEURL;

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: () =>
      api.get(`api/project/${projectId}/files`).then((res) => {
        return res.data.data;
      }),
  });

  useEffect(() => {
    refetch();
  }, [projectId]);

  return (
    <Card className="rounded-3">
      <CardBody>
        {isLoading ? (
          'Loading...'
        ) : error ? (
          'Something went wrong.'
        ) : (
          <Table className="no-wrap align-middle" hover style={{ zIndex: '-1', fontSize: '13px' }}>
            <thead>
              <tr>
                <th width="60">#</th>
                <th width="700">Filename</th>
                <th>User</th>
                <th width="200">Uploaded at</th>
              </tr>
            </thead>
            {data?.length ? (
              <tbody style={{ overflow: 'hidden' }}>
                {sortFileByDate(data)
                  ?.reverse()
                  .map((f, i) => (
                    <tr key={f.file_id}>
                      <td>{i + 1}</td>
                      <td>
                        <Link to={`${fileUrl}taskfiles/${f.file_name}`} target="blank">
                          {f.file_name}
                        </Link>
                      </td>
                      <td>{f.employee || '-'}</td>
                      <td>{newDate(f.created_at)}</td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <tbody style={{ overflow: 'hidden' }}>
                <tr>
                  <td colSpan="4" className="text-center">
                    No data yet.
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        )}
      </CardBody>
    </Card>
  );
};

export default FileTab;
