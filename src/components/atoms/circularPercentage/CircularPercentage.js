import React from 'react';
import './CircularPercentage.scss';
import PropTypes from 'prop-types';

const CircularPercentage = ({ data }) => {
  return (
    <div className="flex-wrapper">
      <div className="single-chart">
        <svg viewBox="0 0 36 36" className={`circular-chart ${data === 100 ? 'green' : 'blue'}`}>
          <path
            className="circle-bg"
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle"
            strokeDasharray={`${data}, 100`}
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {data === 100 ? (
            <text x="18" y="22.35" className="percentage" style={{ fontSize: '14px' }}>
              ✔
            </text>
          ) : (
            <text x="18" y="22.35" className="percentage">
              {data}%
            </text>
          )}
        </svg>
      </div>

      {/* <div class="single-chart">
        <svg viewBox="0 0 36 36" class="circular-chart green">
          <path
            class="circle-bg"
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            stroke-dasharray="60, 100"
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" class="percentage">
            60%
          </text>
        </svg>
      </div>

      <div class="single-chart">
        <svg viewBox="0 0 36 36" class="circular-chart blue">
          <path
            class="circle-bg"
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            stroke-dasharray="90, 100"
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" class="percentage">
            90%
          </text>
        </svg>
      </div> */}
    </div>
  );
};

CircularPercentage.propTypes = {
  data: PropTypes.number,
};

export default CircularPercentage;
