import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BoardToDo from './BoardToDo';
import BoardInProgress from './BoardInProgress';
import useAxios from '../../hooks/useAxios';
import BoardDone from './BoardDone';
// import NewTaskModal from './NewTaskModal';

const BoardTab = () => {
  const { projectId } = useParams();
  const [todos, setTodos] = useState();
  const [inProgress, setInProgress] = useState();
  const [Done, setDone] = useState();

  const api = useAxios();

  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ['todos'],
    queryFn: () =>
      api.get(`/task/${projectId}`).then((res) => {
        return res.data.tasks;
      }),
  });

  useEffect(() => {
    const todofFiltered = data?.filter((task) => {
      return task.status === 0;
    });

    const inProgressfFiltered = data?.filter((task) => {
      return task.status === 1;
    });

    const DoneFiltered = data?.filter((task) => {
      return task.status === 2;
    });

    setTodos(todofFiltered);
    setInProgress(inProgressfFiltered);
    setDone(DoneFiltered);
  }, [data]);

  return (
    <Row>
      {/* <Col lg="12">
        <div className="search text-muted">
          <div className="search-input">
            <MaterialIcon icon="search" />
            <input type="text" placeholder="search task .." />
          </div>
          <button type="button" className="text-dark" onClick={toggle.bind(null)}>
            <MaterialIcon icon="add" />
            New Task
          </button>
          <NewTaskModal {...{ modal, setModal, toggle }} />
        </div>
      </Col> */}
      <BoardToDo data={todos} {...{ isLoading, error, refetch, isRefetching }} />
      <BoardInProgress data={inProgress} {...{ isLoading, error, refetch, isRefetching }} />
      <BoardDone data={Done} {...{ isLoading, error, refetch, isRefetching }} />
    </Row>
  );
};

export default BoardTab;
