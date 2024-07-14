import { useQuery } from '@tanstack/react-query';
import { Row, Col } from 'reactstrap';
import TopCardsData from './TopCardsData';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';

const TopCards = () => {
  const { auth } = useAuth();
  const api = useAxios();

  const { isLoading, data } = useQuery({
    queryKey: ['totaldata'],
    queryFn: () =>
      api.get(`api/project/${auth?.user.employe_id}/total-data`).then((res) => {
        return res.data.data;
      }),
  });

  return (
    <Row>
      <Col sm="6" lg="3">
        <TopCardsData
          bg="primary"
          icon="wallet2"
          title={data?.total_project}
          subtitle="Total Project"
          loading={isLoading}
        />
      </Col>
      <Col sm="6" lg="3">
        <TopCardsData
          bg="info"
          icon="list-task"
          title={data?.total_task}
          subtitle="Total Task"
          loading={isLoading}
        />
      </Col>
      <Col sm="6" lg="3">
        <TopCardsData
          bg="warning"
          icon="clock-history"
          title={data?.total_inprogress}
          subtitle="Task In Progress"
          loading={isLoading}
        />
      </Col>
      <Col sm="6" lg="3">
        <TopCardsData
          bg="success"
          icon="check-circle"
          title={data?.total_done}
          subtitle="Task Done"
          loading={isLoading}
        />
      </Col>
    </Row>
  );
};

export default TopCards;
