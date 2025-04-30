import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { HourglassBottom, CheckCircle, Assignment } from '@mui/icons-material';
import PropTypes from 'prop-types';

const StatCard = ({ color, icon, title, count }) => (
  <Card className="shadow-sm border-0" style={{ borderLeft: `5px solid ${color}` }}>
    <CardBody className="d-flex align-items-center">
      <div style={{ fontSize: '2rem', color, marginRight: '1rem' }}>{icon}</div>
      <div>
        <h6 className="mb-1 text-muted">{title}</h6>
        <h3 className="mb-0">{count}</h3>
      </div>
    </CardBody>
  </Card>
);

StatCard.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  count: PropTypes.number,
};

const Dashboard = ({ diproses, selesai, totalPengajuan }) => {
  return (
    <div>
      {/* <h2 className="mb-4 fw-bold">Dashboard</h2> */}
      <Row>
        <Col md="4" sm="12" className="mb-3">
          <StatCard
            color="#f0ad4e"
            icon={<HourglassBottom fontSize="inherit" />}
            title="Pengajuan Diproses"
            count={(diproses === 0 ? '0' : diproses) || 'loading...'}
          />
        </Col>
        <Col md="4" sm="12" className="mb-3">
          <StatCard
            color="#5cb85c"
            icon={<CheckCircle fontSize="inherit" />}
            title="Pengajuan Selesai"
            count={(selesai === 0 ? '0' : selesai) || 'loading...'}
          />
        </Col>
        <Col md="4" sm="12" className="mb-3">
          <StatCard
            color="#d9534f"
            icon={<Assignment fontSize="inherit" />}
            title="Total Pengajuan"
            count={(totalPengajuan === 0 ? '0' : totalPengajuan) || 'loading...'}
          />
        </Col>
      </Row>
    </div>
  );
};

Dashboard.propTypes = {
  diproses: PropTypes.number,
  selesai: PropTypes.number,
  totalPengajuan: PropTypes.number,
};

export default Dashboard;
