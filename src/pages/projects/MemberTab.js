import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
// import MaterialIcon from '@material/react-material-icon';
import useAxios from '../../hooks/useAxios';
import RoundedTable from '../../components/roundedTable/RoundedTable';
// import useAuth from '../../hooks/useAuth';

const selectedCount = (obj, row) => {
  return obj[row];
};

const MemberTab = () => {
  const [totalTask, setTotalTask] = useState();
  const api = useAxios();

  const { projectId } = useParams();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['members'],
    queryFn: () =>
      api.get(`api/project/${projectId}/members`).then((res) => {
        setTotalTask(res.data.count_task);
        return res.data.data;
      }),
  });

  useEffect(() => {
    refetch();
  }, [projectId]);

  // const addMemberAllowedRole = 'Manager';

  return (
    <Col>
      <Card className="rounded-3">
        <CardBody>
          {/* {auth.user.roles.includes(addMemberAllowedRole) && (
            <Col className="d-flex justify-content-end" col="12">
              <Button
                className="btn d-flex gap-1 align-items-center rounded-5 px-2"
                outline
                color="success"
                size="sm"
              >
                <MaterialIcon icon="add" style={{ fontSize: '16px' }} />
                Member
              </Button>
            </Col>
          )} */}
          {isLoading ? (
            'Loading...'
          ) : error ? (
            'Something went wrong.'
          ) : data?.length > 0 ? (
            <RoundedTable>
              <>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Total Task</th>
                  </tr>
                </thead>
                <tbody style={{ overflow: 'hidden' }}>
                  {data?.map((m, i) => (
                    <tr key={m.first_name}>
                      <td>{i + 1}</td>
                      <td>{m.first_name}</td>
                      <td>{m.position_name}</td>
                      <td>{totalTask ? selectedCount(totalTask, m.employe_id.toString()) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </>
            </RoundedTable>
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
