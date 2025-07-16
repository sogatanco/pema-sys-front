import React from 'react';
import { useQuery } from '@tanstack/react-query';
import TaskCard from './components/taskCard/TaskCard';
import useAxios from '../../hooks/useAxios';

const AdditionalTaskCard = () => {
  const api = useAxios();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tambahan-list'],
    queryFn: () =>
      api.get(`api/module/daily/by-category/tambahan`).then((res) => {
        return res.data.data;
      }),
  });

  return isLoading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Error: {error.message}</div>
  ) : (
    <div className="daily-card">
      <TaskCard title="Tugas Tambahan" task={data} refetch={refetch} category="tambahan" />
    </div>
  );
};

export default AdditionalTaskCard;
