import { Col, Row } from 'reactstrap';
import useAuth from '../../hooks/useAuth';
import Director from './Director';
import ProjectList from './ProjectList';
import TopCards from './TopCards';
import DailyDashboard from './DailyDashboard';
import './Dashboard.scss';
import TaskList from './TaskList';
import AdditionalTask from './AdditionalTask';
// import Daily from './Daily';

const Dashboard2 = () => {
  const { auth } = useAuth();
  const isManager = auth?.user.roles.includes('Manager');
  const isSupervisor = auth?.user.roles.includes('Supervisor');

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
          {(isSupervisor || isManager) && <DailyDashboard />}
        </Col>
        <Col lg="4">
          <TaskList title="Recent Tasks" type="recent" />
          <AdditionalTask />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard2;
