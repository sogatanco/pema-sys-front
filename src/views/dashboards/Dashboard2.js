import { Col, Row } from 'reactstrap';
import TopCards from '../../components/dashboard/dashboard2/TopCards';
import Daily from './Daily';
import TaskList from './TaskList';
import Project from './Project';
import UserStatus from './UserStatus';

const Dashboard2 = () => {
  return (
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
