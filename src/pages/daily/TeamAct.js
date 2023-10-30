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
} from 'reactstrap';
// import { useReactToPrint } from 'react-to-print';
import useAxios from '../../hooks/useAxios';
import { alert } from '../../components/atoms/Toast';

const TeamAct = () => {
  const [filterby, setFilterby] = useState('today');
  const [modal, setModal] = useState(false);
  const [assignee, SetAssignee] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle1 = () => setDropdownOpen((prevState) => !prevState);
  const api = useAxios();
  const { data, refetch } = useQuery({
    queryKey: ['cat'],
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

  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-end">
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
          {data?.length > 0 ? (
            <Table striped className="mt-2">
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
                        {d?.member?.map((m) => (
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
                        ))}
                      </div>
                    </th>
                    <th scope="row">
                      <Badge color={parseInt(d.progress, 10) === 100 ? 'success' : 'warning'}>
                        {d.progress} %
                      </Badge>
                    </th>
                    <th scope="row">
                      <Badge color={d.status === 'approve' ? 'success' : 'warning'}>
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
