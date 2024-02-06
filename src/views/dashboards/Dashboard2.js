import { Col, Row } from 'reactstrap';
import useAuth from '../../hooks/useAuth';
import Director from './Director';
import ProjectList from './ProjectList';
import TopCards from './TopCards';
import './Dashboard.scss';
import TaskList from './TaskList';
// import Daily from './Daily';

const Dashboard2 = () => {
  const { auth } = useAuth();

  return auth.user.roles.includes('Director') ? (
    <Director />
  ) : (
    <>
      <TopCards />
      <Row>
        {/* <Col lg="4">
          <Project />
          <Row>
            <UserStatus />
          </Row>
        </Col> */}
        {/* <Col lg="4">
          <Daily />
        </Col> */}
        <Col lg="8">
          <ProjectList />
        </Col>
        <Col lg="4">
          <TaskList />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard2;
