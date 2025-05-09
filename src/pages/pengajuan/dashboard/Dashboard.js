import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const options1 = {
  chart: {
    toolbar: { show: false },
    fontFamily: "'Poppins', sans-serif",
  },
  dataLabels: { enabled: false },
  colors: ['rgba(255,255,255,0.5)'],
  xaxis: {
    categories: ['0', '4', '8', '12', '16', '20', '24', '30'],
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: 'rgba(255, 255, 255, 0.5)',
  },
  yaxis: { show: false },
  grid: { show: false },
  tooltip: { enabled: false, theme: 'dark' },
};

const series1 = [
  {
    name: 'Bandwidth usage',
    data: [5, 0, 12, 1, 8, 3, 12, 15],
  },
];

const optionsbar = {
  chart: {
    fontFamily: "'Rubik', sans-serif",
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Permohonan Biaya', 'Tagihan Biaya', 'Aktual Biaya', 'Reimbursement'],
    labels: { show: false },
  },
  plotOptions: {
    bar: {
      distributed: true,
      horizontal: false,
    },
  },
  grid: {
    borderColor: 'rgba(0,0,0,0.1)',
  },
  yaxis: {
    labels: {
      style: {
        cssClass: 'grey--text lighten-2--text fill-color',
      },
    },
  },
  title: {
    text: `Grafik Pengajuan Tahun ${new Date().getFullYear()}`,
    align: 'left',
    style: {
      fontSize: '16px',
      color: '#6c757d',
    },
  },
  tooltip: {
    theme: 'dark',
  },
};

const Dashboard = ({ diproses, selesai, totalPengajuan, dataChart }) => {
  const categories = ['Permohonan Biaya', 'Tagihan Biaya', 'Aktual Biaya', 'Reimbursement'];

  const seriesbar = [
    {
      name: 'Pengajuan',
      data: categories?.map((kategori) => {
        const found = dataChart?.find((item) => item.kategori === kategori);
        return found ? found.total : 0;
      }),
    },
  ];

  return (
    <div>
      <Card>
        <CardBody>
          <Row>
            <Col md={4} className="mt-3">
              <Card className="bg-warning">
                <CardBody>
                  <div className="d-flex">
                    <div className="me-3 align-self-center">
                      <h1 className="text-dark-white">
                        <i className="bi bi-pie-chart"></i>
                      </h1>
                    </div>
                    <div>
                      <h4 className="text-dark-white">Pengajuan Diproses</h4>
                      <h6 className="text-dark-white">Tahun {new Date().getFullYear()}</h6>
                    </div>
                  </div>
                  <Row>
                    <Col xs={5} className="d-flex align-items-center">
                      <h1 className="text-dark-white text-truncate mb-0">{diproses}</h1>
                    </Col>
                    <Col xs={7} className="align-self-center">
                      <div className="d-flex align-items-center" style={{ height: '105px' }}>
                        <Chart options={options1} series={series1} type="scatter" height="120" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col md={4} className="mt-3">
              <Card className="bg-success">
                <CardBody>
                  <div className="d-flex">
                    <div className="me-3 align-self-center">
                      <h1 className="text-dark-white">
                        <i className="bi bi-pie-chart"></i>
                      </h1>
                    </div>
                    <div>
                      <h4 className="text-dark-white">Pengajuan Selesai</h4>
                      <h6 className="text-dark-white">Tahun {new Date().getFullYear()}</h6>
                    </div>
                  </div>
                  <Row>
                    <Col xs={5} className="d-flex align-items-center">
                      <h1 className="text-dark-white text-truncate mb-0">{selesai}</h1>
                    </Col>
                    <Col xs={7} className="align-self-center">
                      <div className="d-flex align-items-center" style={{ height: '105px' }}>
                        <Chart options={options1} series={series1} type="area" height="120" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            <Col md={4} className="mt-3">
              <Card className="bg-info">
                <CardBody>
                  <div className="d-flex">
                    <div className="me-3 align-self-center">
                      <h1 className="text-dark-white">
                        <i className="bi bi-pie-chart"></i>
                      </h1>
                    </div>
                    <div>
                      <h4 className="text-dark-white">Total Pengajuan</h4>
                      <h6 className="text-dark-white">Tahun {new Date().getFullYear()}</h6>
                    </div>
                  </div>
                  <Row>
                    <Col xs={5} className="d-flex align-items-center">
                      <h1 className="text-dark-white text-truncate mb-0">{totalPengajuan}</h1>
                    </Col>
                    <Col xs={7} className="align-self-center">
                      <div className="d-flex align-items-center" style={{ height: '105px' }}>
                        <Chart options={options1} series={series1} type="line" height="120" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={8}>
              <Chart
                options={{ ...optionsbar, xaxis: { categories } }}
                series={seriesbar}
                type="bar"
                height="500"
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

Dashboard.propTypes = {
  diproses: PropTypes.number.isRequired,
  selesai: PropTypes.number.isRequired,
  totalPengajuan: PropTypes.number.isRequired,
  dataChart: PropTypes.arrayOf(
    PropTypes.shape({
      kategori: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default Dashboard;
