import React, { useEffect, useState } from 'react';
import Nav from '../../components/nav/Nav';
import TicketList from './TicketList';
import RequestsList from './RequestsList';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const items = [
  {
    id: 1,
    label: 'My Tickets',
    countable: false,
  },
  {
    id: 2,
    label: 'Requests',
    countable: true,
  },
];

const TicketHome = () => {
  const { auth } = useAuth();
  const [navActive, setNavActive] = useState(1);
  const [totalRequest, setTotalRequest] = useState(0);

  const api = useAxios();

  const isManager = auth?.user.roles.includes('Manager');

  useEffect(() => {
    async function fetchTotalRequest() {
      await api
        .get(`api/ticket/manager?type=count`)
        .then((res) => {
          setTotalRequest(res.data.data);
        })
        .catch(() => {
          setTotalRequest(0);
        });
    }

    if (isManager) {
      fetchTotalRequest();
    }
  }, []);

  return (
    <>
      {isManager && <Nav {...{ items, navActive, setNavActive }} count={totalRequest} />}
      {navActive === 1 ? <TicketList /> : <RequestsList {...{ setTotalRequest }} />}
    </>
  );
};

export default TicketHome;
