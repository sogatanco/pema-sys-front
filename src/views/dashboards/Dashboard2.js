import { Col, Row } from 'reactstrap';
import TopCards from '../../components/dashboard/dashboard2/TopCards';
import Daily from './Daily';
import TaskList from './TaskList';
import Project from './Project';
import UserStatus from './UserStatus';
import useAuth from '../../hooks/useAuth';
import Director from './Director';

const Dashboard2 = () => {
  const { auth } = useAuth();

  return auth.user.roles.includes('Director') ? (
    <>
      <TopCards />
      <Row>
        <Col lg="4">
          <Project />
          <Row>
            <UserStatus />
          </Row>
        </Col>
        <Col lg="4">
          <Daily />
        </Col>
        <Col lg="4">
          <TaskList />
        </Col>
      </Row>
    </>
  ) : (
    <>
      <TopCards />
      <Row>
        <Col lg="4">
          <Project />
          <Row>
            <UserStatus />
          </Row>
        </Col>
        <Col lg="4">
          <Daily />
        </Col>
        <Col lg="4">
          <TaskList />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard2;
