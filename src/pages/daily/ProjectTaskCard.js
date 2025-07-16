import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import Timeline from './components/timeline/Timeline';
import Search from './components/search/Search';
import Button from './components/button/Button';
import TaskCard from './components/taskCard/TaskCard';

const ProjectTaskCard = () => {
  const api = useAxios();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['daily-list'],
    queryFn: () =>
      api.get(`api/daily/list-by-employee?year=2025&search=`).then((res) => {
        return res.data.data;
      }),
  });
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        data?.map((item) => (
          <div className="daily-card project">
            <div className="card-header">
              <div className="header-title">
                <h4>{item.project_name}</h4>
                <div className="title-attribute">
                  <Timeline dateRange={item.date_range} />
                  <div className="attribute-item">
                    <span>{item.total_task}</span>
                    <span>Task</span>
                  </div>
                </div>
              </div>
              <div className="header-action">
                <Search />
                <Button actionFn={() => {}} color="grey" icon="filter_list" />
              </div>
            </div>
            <div className="card-body">
              {item?.project_task?.map((task) => (
                <TaskCard task={task} category="non-rutin" refetch={refetch} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectTaskCard;
