import React, { useState } from 'react';
import Bell from '../../components/bell/Bell';
import TaskDetail from '../../components/taskDetail/TaskDetail';

const NotificationP = () => {
  const [showTask, setShowTask] = useState(false);
  const [taskId, setTaskId] = useState();

  return (
    <>
      <Bell {...{ setShowTask, setTaskId }} />
      <TaskDetail {...{ showTask, setShowTask, taskId }} />
    </>
  );
};

export default NotificationP;
