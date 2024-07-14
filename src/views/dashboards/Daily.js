import React from 'react';
import Chart from 'react-apexcharts';
import DashCard from '../../components/dashboard/dashboardCards/DashCard';

const Daily = () => {
  const optionsvisitors = {
    labels: ['Rutin', 'Non Rutin', 'Add'],
    chart: {
      fontFamily: "'Poppins', sans-serif",
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
      borderColor: 'transparent',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '82px',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '18px',
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: true,
              color: '#99abb4',
            },
            total: {
              show: true,
              label: 'Daily',
              color: '#99abb4',
            },
          },
        },
      },
    },
    stroke: {
      width: 1,
      colors: 'transparent',
    },
    legend: {
      show: false,
    },
    colors: ['#1e88e5', '#26c6da', '#eceff1'],
    tooltip: {
      fillSeriesColor: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
        },
      },
    ],
  };

  const seriesvisitors = [50, 20, 30];
  return (
    <DashCard title="My Daily">
      <div className="position-relative" style={{ height: '268px' }}>
        <Chart options={optionsvisitors} series={seriesvisitors} type="donut" height="255px" />
      </div>
      <div className="hstack gap-2 justify-content-center">
        <div className="d-flex align-items-center text-primary fs-6">
          <i className="bi bi-circle-fill fs-7 me-2"></i>Rutin
        </div>
        <div className="d-flex align-items-center text-success fs-6">
          <i className="bi bi-circle-fill fs-7 me-2"></i>Non Rutin
        </div>
        <div className="d-flex align-items-center text-muted fs-6">
          <i className="bi bi-circle-fill fs-7 me-2"></i>Add
        </div>
      </div>
    </DashCard>
  );
};

export default Daily;
