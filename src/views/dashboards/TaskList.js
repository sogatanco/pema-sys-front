import React from 'react';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import CircularPercentage from '../../components/atoms/circularPercentage/CircularPercentage';

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
        <div className="d-flex justify-content-between">
          <CardTitle tag="h4">Recent Tasks</CardTitle>
          <Link to="projects" style={{ textDecoration: 'none' }}>
            See all
          </Link>
        </div>
        <div className="d-flex flex-column gap-2 ">
          {isLoading ? (
            'Loading...'
          ) : error ? (
            'Something went wrong.'
          ) : data?.length > 0 ? (
            data.map((t, i) => (
              <div
                key={t.task_id}
                className="d-flex justify-content-between align-items-center p-2 rounded-3 link-item-bordered"
                style={{ border: '1px dashed #21C1D6' }}
              >
                <Link
                  className="d-flex gap-2 col-md-10 align-items-center text-muted"
                  style={{ fontSize: '13px', textDecoration: 'none' }}
                  to={`projects/details/${t.project_id}`}
                >
                  <span>{i + 1}</span>
                  <div className="d-flex flex-column col-md-12">
                    <div className="d-flex">
                      <span className="text-dark">
                        {t?.task_title.trim().length > 45
                          ? `${t?.task_title?.substring(0, 45)}...`
                          : t?.task_title}
                      </span>
                    </div>
                    <div className="d-flex align-items-end gap-3">
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
                      <span style={{ fontSize: '12px' }} className="text-muted">
                        Deadline: {t?.end_date}
                      </span>
                    </div>
                  </div>
                </Link>
                <div>
                  <div className="d-flex gap-1 justify-content-center align-items-center">
                    <div className="circular-progress">
                      <CircularPercentage data={t.task_progress} color="red" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex justify-content-center">
              <p className="text-muted">No data yet.</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default TaskList;
