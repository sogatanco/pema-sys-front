import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BoardToDo from './BoardToDo';
import BoardInProgress from './BoardInProgress';
import useAxios from '../../hooks/useAxios';
import BoardDone from './BoardDone';
// import NewTaskModal from './NewTaskModal';

const removeDuplicates = (arr) => {
  return arr?.filter(
    (obj, index) => arr?.findIndex((item) => item.task_id === obj.task_id) === index,
  );
};

const BoardTab = () => {
  const { projectId } = useParams();
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [Done, setDone] = useState([]);
  const [directSupervisor, setDirectSupervisor] = useState('');
  const [isMemberActive, setIsMemberActive] = useState(false);

  const api = useAxios();

  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ['todos'],
    queryFn: () =>
      api.get(`api/task/${projectId}/employe/list`).then((res) => {
        setIsMemberActive(res.data.is_member_active);
        setDirectSupervisor(res.data.direct_supervisor.toString());
        return res.data.data;
      }),
  });

  useEffect(() => {
    const todofFiltered = data?.filter((taska) => {
      return parseInt(taska.status, 10) === 0 || parseInt(taska.status, 10) === 4;
    });

    const inProgressfFiltered = data?.filter((taska) => {
      return parseInt(taska.status, 10) === 1;
    });

    const DoneFiltered = data?.filter((taska) => {
      return parseInt(taska.status, 10) === 2 || parseInt(taska.status, 10) === 3;
    });

    setTodos(todofFiltered);
    setInProgress(removeDuplicates(inProgressfFiltered));
    setDone(removeDuplicates(DoneFiltered));
  }, [data]);

  useEffect(() => {
    refetch();
  }, [projectId]);

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
      {isLoading ? (
        <Col>
          <Card>
            <CardBody className="text-center">
              <h6 className="tex-muted">Loading...</h6>
            </CardBody>
          </Card>
        </Col>
      ) : (
        <Col>
          {/* <div
            className="d-flex  justify-content-between align-items-center mb-2"
            style={{ borderBottom: '0.7px solid grey' }}
          >
            <div className="d-flex align-items-center ">
              <span className="fw-bold">List Task</span>
            </div>
            <div className="d-flex gap-4">
              <span>Filter</span>
              <span>Sort</span>
              <div className="input-search">
                <input type="text" placeholder="search.." />
              </div>
            </div>
          </div> */}
          <Row>
            <BoardToDo
              data={todos}
              {...{ directSupervisor, isLoading, error, refetch, isRefetching, isMemberActive }}
            />
            <BoardInProgress
              data={inProgress}
              {...{ directSupervisor, isLoading, error, refetch, isRefetching, isMemberActive }}
            />
            <BoardDone data={Done} {...{ isLoading, error, refetch, isRefetching }} />
          </Row>
        </Col>
      )}
      {/* // ) : isMemberActive ? ( //{' '}
      <>
        // <BoardToDo data={todos} {...{ isLoading, error, refetch, isRefetching }} />
        // <BoardInProgress data={inProgress} {...{ isLoading, error, refetch, isRefetching }} />
        // <BoardDone data={Done} {...{ isLoading, error, refetch, isRefetching }} />
        //{' '}
      </>
      // ) : ( //{' '}
      <Col>
        //{' '}
        <Card>
          //{' '}
          <CardBody className="text-center">
            //{' '}
            <h6 className="tex-muted">
              // You cannot create a task because you are not an active member. //{' '}
            </h6>
            //{' '}
          </CardBody>
          //{' '}
        </Card>
        //{' '}
      </Col>
      // )} */}
    </Row>
  );
};

export default BoardTab;
