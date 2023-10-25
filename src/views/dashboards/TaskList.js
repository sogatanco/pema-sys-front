import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import './TaskList.scss';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const TaskList = () => {
  const { auth } = useAuth();
  const api = useAxios();

  const { isLoading, error, data } = useQuery({
    queryKey: ['tasklist'],
    queryFn: () =>
      api.get(`api/task/${auth?.user.employe_id}/recent/activity`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <Card>
      <CardBody className="d-flex flex-column gap-1">
        <CardTitle tag="h4">Task List</CardTitle>
        <div className="d-flex flex-column gap-3">
          {isLoading
            ? 'Loading...'
            : error
            ? 'Something went wrong.'
            : data?.map((t, i) => (
                <div key={t.task_id} className="d-flex justify-content-between">
                  <div className="d-flex gap-2 col-md-8" style={{ fontSize: '13px' }}>
                    <span>{i + 1}.</span>
                    <span>{t.task_title.substring(0, 30)}</span>
                  </div>
                  <div>
                    <span className="badge text-primary bg-light-primary rounded-pill d-inline-block">
                      {t.status === 0
                        ? 'To do'
                        : t.status === 1
                        ? 'In progress'
                        : t.status === 2
                        ? 'Review'
                        : t.status === 3
                        ? 'Approved'
                        : 'Revision'}
                    </span>
                  </div>
                </div>
              ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default TaskList;
