import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import MaterialIcon from '@material/react-material-icon';
import {
  Card,
  CardBody,
  Table,
  Badge,
  Modal,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Col,
  Row,
  Container,
} from 'reactstrap';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';
import TopCardsData from '../../views/dashboards/TopCardsData';

const TeamAct = () => {
  const [filterby, setFilterby] = useState('today');
  const [modal, setModal] = useState(false);
  const [assignee, SetAssignee] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [todo, setTodo] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(0);
  const toggle1 = () => setDropdownOpen((prevState) => !prevState);
  const api = useAxios();
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['catdfhds'],
    queryFn: () =>
      api.get(`dapi/myteam/activities/${filterby}`).then((res) => {
        return res.data.data;
      }),
  });
  const toggle = (p) => {
    setModal(!modal);
    if (!modal) {
      SetAssignee(p);
    }
  };

  const handleFiltere = (f) => {
    setFilterby(f);
    alert(`success`, `My Activity fitlered by start : ${f}`);
  };

  useEffect(() => {
    refetch();
  }, [filterby]);


  useEffect(() => {
    const todofFiltered = data?.filter((act) => parseInt(act.progress, 10) === 0);
    const progressFiltered = data?.filter(
      (act) => parseInt(act.progress, 10) > 0 && parseInt(act.progress, 10) < 100,
    );
    const doneFiltered = data?.filter((act) => parseInt(act.progress, 10) === 100);
    setTodo(todofFiltered?.length);
    setProgress(progressFiltered?.length);
    setDone(doneFiltered?.length);
  }, [data]);

  console.log(data);


  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-end">
            <Container>
              <Row>
                <Col>
                  <TopCardsData
                    bg="danger"
                    icon="play-circle"
                    title={todo}
                    subtitle="Todo Activity"
                    loading={isLoading}
                  />
                </Col>
                <Col>
                  <TopCardsData
                    bg="warning"
                    icon="arrow-repeat"
                    title={progress}
                    subtitle="On Process"
                    loading={isLoading}
                  />
                </Col>
                <Col>
                  <TopCardsData
                    bg="success"
                    icon="check-circle"
                    title={done}
                    subtitle="Done Activity"
                    loading={isLoading}
                  />
                </Col>
              </Row>
            </Container>
            <div>
              <Dropdown isOpen={dropdownOpen} toggle={toggle1} className="mb-3">
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
          </div>
          {data?.length > 0 ? (
            <Table striped className="mt-2" id="printablediv">
              <thead>
                <tr>
                  <th>Activities</th>
                  <th>Due Date</th>
                  <th>Poin</th>
                  <th>Assignee</th>
                  <th>Progres</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((d) => (
                  <tr key={d.id}>
                    <th scope="row">{d.activity}</th>
                    <th scope="row">{d.end}</th>
                    <th scope="row">{d.poin}</th>
                    <th scope="row">
                      <div className="member" onClick={() => toggle(d.member)}>
                        {d?.member?.map((m, r) =>
                          r < 3 ? (
                            <img
                              key={m?.employe_id}
                              src={
                                m?.img
                                  ? m?.img
                                  : 'https://i.pinimg.com/736x/10/ec/86/10ec8691f73b787677bd0bbeddbd22e0.jpg'
                              }
                              className="rounded-circle"
                              alt="avatar"
                              width="35"
                              height="35"
                            />
                          ) : (
                            ''
                          ),
                        )}

                        {d?.member?.length > 3 ? (
                          <img
                            src="https://cdn5.vectorstock.com/i/1000x1000/38/64/color-circle-with-plus-icon-vector-13503864.jpg"
                            className="rounded-circle img-pluss"
                            alt="avatar"
                            width="20"
                            height="20"
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </th>
                    <th scope="row">
                      <Badge color={parseInt(d?.progress, 10) === 100 ? 'success' : 'warning'}>
                        {d.progress} %
                      </Badge>
                    </th>
                    <th scope="row">
                      <Badge color={d?.status === 'approve' ? 'success' : 'warning'}>
                        {d.status}
                      </Badge>
                    </th>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center mt-2">no data available yet, please come back in a moment</p>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
          {assignee?.map((a) => (
            <Badge key={a.employe_id} color="primary" className="me-2">
              {a.first_name}
            </Badge>
          ))}
        </ModalBody>
      </Modal>
    </>
  );
};

export default TeamAct;
