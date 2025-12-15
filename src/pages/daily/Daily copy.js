import React, { useState } from 'react';
import './Daily.scss';
import AdditionalTaskCard from './AdditionalTaskCard';
import ProjectTaskCard from './ProjectTaskCard';
import DailyFilter from './components/filter/DailyFilter';
import StaffDropdown from './components/staffDropdown/StaffDropdown';

const Daily = () => {
  // === Filter state ===
  const [filters, setFilters] = useState({
    sort: 'all',
    kategori: 'all',
    is_priority: 'all',
    tipe: 'all',
    tahun: new Date().getFullYear().toString(),
    bulan: '',
    employe_id: '',
  });

  // === Handler filter change ===
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // === Detail proyek ===
  const [projectDetail, setProjectDetail] = useState({ totalProject: 0 });
  const [projectAdditionalDetail, setProjectAdditionalDetail] = useState({ totalAdditional: 0 });

  const onProjectDetailChange = (details) => {
    setProjectDetail({
      totalProject: details.totalProject || 0,
      totalDaily: details.totalDaily || 0,
      formattedEmploye: details.formattedEmploye || null,
      totalAdditional: details.totalAdditional || 0,
    });
  };

  const onProjectAdditionalDetailChange = (details) => {
    setProjectAdditionalDetail({
      totalAdditional: details.totalAdditional || 0,
    });
  };

  return (
    <div className="daily-container">
      <div className="daily-header">
        {/* === Dropdown Staff === */}
        <StaffDropdown handleFilterChange={handleFilterChange} />

        {/* === Statistik Proyek === */}
        <div className="header-card">
          <div className="card-total">
            <h6 className="mb-0">{projectDetail?.totalProject || 0}</h6>
            <span className="text-muted">Proyek</span>
          </div>
        </div>

        <div className="header-card">
          <div className="card-total">
            <h6 className="mb-0">{projectAdditionalDetail?.totalAdditional || 0}</h6>
            <span className="text-muted">Tambahan</span>
          </div>
        </div>

        <div className="header-card">
          <div className="card-total">
            <h6 className="mb-0">
              {(projectDetail?.totalDaily || 0) + (projectAdditionalDetail?.totalAdditional || 0)}
            </h6>
            <span className="text-muted">Task {filters.tahun}</span>
          </div>
        </div>
      </div>

      {/* === Body === */}
      <div className="daily-body">
        <DailyFilter filters={filters} onFilterChange={handleFilterChange} />
        <div className="daily-cards">
          <AdditionalTaskCard
            filters={filters}
            onProjectAdditionalDetailChange={onProjectAdditionalDetailChange}
          />
          <ProjectTaskCard filters={filters} onProjectDetailChange={onProjectDetailChange} />
        </div>
      </div>
    </div>
  );
};

export default Daily;
