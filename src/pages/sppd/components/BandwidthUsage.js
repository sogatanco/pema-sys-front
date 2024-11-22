import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody } from 'reactstrap';
import Chart from 'react-apexcharts';

const BandwidthUsage = ({title, sub, count, tipe, color}) => {
  const options1 = {
    chart: {
      toolbar: {
        show: false,
      },
      fontFamily: "'Poppins', sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['rgba(255,255,255,0.5)'],
    xaxis: {
      categories: ['0', '4', '8', '12', '16', '20', '24', '30'],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: "rgba(255, 255, 255, 0.5)",
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const series1 = [
    {
      name: 'Bandwidth usage',
      data: [5, 0, 12, 1, 8, 3, 12, 15],
    },
  ];

  return (
    <Card className={color}>
      <CardBody>
        <div className="d-flex">
          <div className="me-3 align-self-center">
            <h1 className="text-dark-white">
              <i className="bi bi-pie-chart"></i>
            </h1>
          </div>
          <div>
            <h4 className="text-dark-white">{title}</h4>
            <h6 className="text-dark-white">{sub}</h6>
          </div>
        </div>
        <Row>
          <Col xs={5} className="d-flex align-items-center">
            <h1 className="text-dark-white text-truncate mb-0">{count}</h1>
          </Col>
          <Col xs={7} className="align-self-center">
            <div className="d-flex align-items-center" style={{ height: '105px' }}>
              <Chart options={options1} series={series1} type={tipe} height="120" />
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

BandwidthUsage.propTypes = {
  title: PropTypes.string,
  sub: PropTypes.string,
  count: PropTypes.string,
  tipe: PropTypes.string,
  color: PropTypes.string,
};

export default BandwidthUsage;
