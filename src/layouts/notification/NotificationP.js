import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Bell from '../../components/bell/Bell';
import TaskDetail from '../../components/taskDetail/TaskDetail';
import useAxios from '../../hooks/useAxios';

const NotificationP = () => {
  const [showTask, setShowTask] = useState(false);
  const [taskId, setTaskId] = useState();

  const api = useAxios();

  const { data, refetch } = useQuery({
    queryKey: ['notification-list'],
    queryFn: () =>
      api.get(`api/notification`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <>
      <Bell {...{ setShowTask, setTaskId, data, refetch }} />
      <TaskDetail {...{ showTask, setShowTask, taskId }} />
    </>
  );
};

export default NotificationP;
