import React from 'react';
import './Daily.scss';
import AdditionalTaskCard from './AdditionalTaskCard';
import ProjectTaskCard from './ProjectTaskCard';
import DailyFilter from './components/filter/DailyFilter';
import user1 from '../../assets/images/users/user1.jpg';

const Daily = () => {
  return (
    <div className="daily-container">
      <div className="daily-header">
        <div className="header-card">
          <div className="card-person">
            <img src={user1} className="rounded-circle" alt="avatar" width="38" height="38" />
            <div className="person-info">
              <h6 className="mb-0">Dimas</h6>
              <span className="text-muted">Project Manager</span>
            </div>
          </div>
        </div>
        <div className="header-card">
          <div className="card-total">
            <h6 className="mb-0">12</h6>
            <span className="text-muted">Proyek</span>
          </div>
        </div>
        <div className="header-card">
          <div className="card-total">
            <h6 className="mb-0">6</h6>
            <span className="text-muted">Rutin</span>
          </div>
        </div>
        <div className="header-card">
          <div className="card-total">
            <h6 className="mb-0">32</h6>
            <span className="text-muted">2025</span>
          </div>
        </div>
      </div>
      <div className="daily-body">
        <DailyFilter />
        <div className="daily-cards">
          <AdditionalTaskCard />
          <ProjectTaskCard />
        </div>
      </div>
    </div>
  );
};

export default Daily;
