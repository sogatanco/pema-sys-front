import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useQueries } from '@tanstack/react-query';
import MaterialIcon from '@material/react-material-icon';
import Newtask from './Newtask';
import TaskBoard from './TaskBoard';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

const Daily = () => {
  const [todos, setTodos] = useState();
  const [progress, setProgress] = useState();
  const [done, setDone] = useState();
  const [employe, setEmploye] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [filtere, setFiltere] = useState('today');

  const api = useAxios();
  const result = useQueries({
    queries: [
      {
        queryKey: ['act', 0],
        queryFn: () =>
          api.get(`dapi/myactivity/${filtere}`).then((res) => {
            return res.data.data;
          }),
      },
      {
        queryKey: ['cat', 1],
        queryFn: () =>
          api.get(`api/employe/assignment-list?search=all`).then((res) => {
            return res.data.data;
          }),
      },
    ],
  });

  const isLoadingAct = result[0].isLoading;
  const { refetch } = result[0];

  useEffect(() => {
    const todofFiltered = result[0]?.data?.filter((act) => parseInt(act.progress, 10) === 0);
    const progressFiltered = result[0]?.data?.filter(
      (act) => parseInt(act.progress, 10) > 0 && parseInt(act.progress, 10) < 100,
    );
    const doneFiltered = result[0]?.data?.filter((act) => parseInt(act.progress, 10) === 100);

    setTodos(todofFiltered);
    setProgress(progressFiltered);
    setDone(doneFiltered);

    setEmploye(result[1]?.data);
  }, [result[0].data]);

  useEffect(() => {
    refetch();
  }, [filtere]);

  const handleFiltere = (f) => {
    setFiltere(f);
    alert(`success`, `My Activity fitlered by start : ${f}`);
  };
  return (
    <>
      <Card className="mb-3">
        <CardBody className="p-4">
          <Newtask {...{ refetch }}></Newtask>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-end">
        <Dropdown isOpen={dropdownOpen} toggle={toggle} className="mb-3">
          <DropdownToggle caret>
            <MaterialIcon icon="filter_alt" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleFiltere('today')}>Today</DropdownItem>
            <DropdownItem onClick={() => handleFiltere('yesterday')}>Yesterday</DropdownItem>
            <DropdownItem onClick={() => handleFiltere('week')}>This Week</DropdownItem>
            <DropdownItem onClick={() => handleFiltere('month')}>This Month</DropdownItem>
            <DropdownItem onClick={() => handleFiltere('year')}>This Years</DropdownItem>
            <DropdownItem onClick={() => handleFiltere('all')}>All The Time</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Row>
        <Col md="4">
          <Card className="mb-3" body>
            <h3 className="mb-0">Todo({todos?.length})</h3>
          </Card>
          <TaskBoard data={todos} {...{ isLoadingAct, employe, refetch }}></TaskBoard>
        </Col>
        <Col md="4">
          <Card className="mb-3" body>
            <h3 className="mb-0">Progres({progress?.length})</h3>
          </Card>
          <TaskBoard data={progress} {...{ isLoadingAct, employe, refetch }}></TaskBoard>
        </Col>
        <Col md="4">
          <Card className="mb-3" body>
            <h3 className="mb-0">Done({done?.length})</h3>
          </Card>
          <TaskBoard data={done} {...{ isLoadingAct, employe, refetch }}></TaskBoard>
        </Col>
      </Row>
    </>
  );
};

export default Daily;
