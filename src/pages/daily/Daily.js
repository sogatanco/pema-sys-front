import React, { useState, useCallback, useEffect } from 'react';
import DailyFilter from './components/filter/DailyFilter';
import AdditionalTaskCard from './components/additionalTaskCard/AdditionalTaskCard';
import ProjectTaskCard from './components/projectTaskCard/ProjectTaskCard';
import StaffDropdown from './components/staffDropdown/StaffDropdown';

import ProjectTaskCardReview from './components/projectTaskCardReview/ProjectTaskCardReview';
import AdditionalTaskCardReview from './components/projectTaskCardReview/AdditionalTaskCardReview';
import './Daily.scss'; // Pastikan Anda juga menambahkan style untuk .review-badge

const Tabs = {
  dailies: 'dailies',
  review: 'review',
  approved: 'approved',
};

const Daily = () => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  const roles = auth?.user?.roles || [];
  const isManager = roles.some((role) => role === 'Manager');
  const isSupervisor = roles.some((role) => role === 'Supervisor');

  const [activeTab, setActiveTab] = useState(Tabs.dailies);
  const [filters, setFilters] = useState({
    sort: 'all',
    kategori: 'all',
    is_priority: 'all',
    tipe: 'all',
    tahun: new Date().getFullYear().toString(),
    bulan: '',
    employe_id: '',
  });

  // ---- Detail Project ----
  const [projectDetail, setProjectDetail] = useState({ totalProject: 0 });
  const [projectAdditionalDetail, setProjectAdditionalDetail] = useState({ totalAdditional: 0 });

  // ---- Review Count State Tambahan ----
  const [projectReviewTotal, setProjectReviewTotal] = useState(0);
  const [additionalReviewTotal, setAdditionalReviewTotal] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Total review gabungan
    setReviewCount(projectReviewTotal + additionalReviewTotal);
  }, [projectReviewTotal, additionalReviewTotal]);

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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const [selectedStaff, setSelectedStaff] = useState();
  const handleSelectedStaffLoaded = useCallback((staffData) => {
    setSelectedStaff(staffData);
    setActiveTab(selectedStaff !== auth?.user?.employe_id && Tabs.dailies);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="daily-container">
      <div className="daily-header">
        <div className="staff-dropdown-wrapper">
          <StaffDropdown
            handleFilterChange={handleFilterChange}
            onSelectedStaffLoaded={handleSelectedStaffLoaded}
          />
        </div>

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
              {projectDetail?.totalDaily + projectAdditionalDetail?.totalAdditional || 0}
            </h6>
            <span className="text-muted">Task {filters?.tahun}</span>
          </div>
        </div>
      </div>

      <div className="daily-body">
        <div className="d-flex justify-content-between">
          <DailyFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            disableFilter={activeTab === Tabs.review || activeTab === Tabs.approved}
          />
          {(isManager || isSupervisor) && selectedStaff?.employe_id === auth?.user?.employe_id && (
            <div className="d-flex d-md-none">
              <div className="tab-container ">
                <button
                  className={`tab-button ${activeTab === Tabs.dailies ? 'active' : ''}`}
                  type="button"
                  onClick={() => handleTabChange(Tabs.dailies)}
                >
                  Dailies
                </button>
                <button
                  className={`tab-button ${activeTab === Tabs.review ? 'active' : ''}`}
                  style={{ position: 'relative' }}
                  type="button"
                  onClick={() => handleTabChange(Tabs.review)}
                >
                  Need Review
                  {/* BADGE NOTIFIKASI MOBILE */}
                  <div style={{ display: 'flex', position: 'relative' }}>
                    {reviewCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-10px',

                          // Gaya Visual Badge
                          backgroundColor: '#f44336',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '2px 6px',
                          fontSize: '10px',
                          minWidth: '18px',
                          textAlign: 'center',
                          lineHeight: '1.2',
                          fontWeight: '700',
                          zIndex: '1',
                        }}
                      >
                        {reviewCount}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  className={`tab-button ${activeTab === Tabs.approved ? 'active' : ''}`}
                  type="button"
                  onClick={() => handleTabChange(Tabs.approved)}
                >
                  Approved
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="daily-cards">
          {(isManager || isSupervisor) && selectedStaff?.employe_id === auth?.user?.employe_id && (
            <div className="d-none d-md-flex justify-content-end">
              <div className="tab-container">
                <button
                  className={`tab-button ${activeTab === Tabs.dailies ? 'active' : ''}`}
                  type="button"
                  onClick={() => handleTabChange(Tabs.dailies)}
                >
                  Dailies
                </button>
                <button
                  className={`tab-button ${activeTab === Tabs.review ? 'active' : ''}`}
                  type="button"
                  onClick={() => handleTabChange(Tabs.review)}
                >
                  Need Review
                  <div style={{ display: 'flex', position: 'relative' }}>
                    {reviewCount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-10px',

                          // Gaya Visual Badge
                          backgroundColor: '#f44336',
                          color: 'white',
                          borderRadius: '50%',
                          padding: '2px 6px',
                          fontSize: '10px',
                          minWidth: '18px',
                          textAlign: 'center',
                          lineHeight: '1.2',
                          fontWeight: '700',
                          zIndex: '10',
                        }}
                      >
                        {reviewCount}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  className={`tab-button ${activeTab === Tabs.approved ? 'active' : ''}`}
                  type="button"
                  onClick={() => handleTabChange(Tabs.approved)}
                >
                  Approved
                </button>
              </div>
            </div>
          )}
          {activeTab === Tabs.dailies && (
            <>
              {(filters?.kategori === 'tambahan' || filters?.kategori === 'all') && (
                <AdditionalTaskCard
                  filters={filters}
                  onProjectAdditionalDetailChange={onProjectAdditionalDetailChange}
                  selectedStaff={selectedStaff}
                  activeTab={Tabs.dailies}
                />
              )}
              {(filters?.kategori === 'projects' || filters?.kategori === 'all') && (
                <ProjectTaskCard
                  filters={filters}
                  onProjectDetailChange={onProjectDetailChange}
                  selectedStaff={selectedStaff}
                  activeTab={Tabs.dailies}
                />
              )}
            </>
          )}

          {activeTab === Tabs.review && (
            <>
              {(filters?.kategori === 'tambahan' || filters?.kategori === 'all') && (
                // Kirim setter function untuk menghitung total review tambahan
                <AdditionalTaskCardReview
                  filters={filters}
                  setReviewTotal={setAdditionalReviewTotal}
                />
              )}
              {(filters?.kategori === 'projects' || filters?.kategori === 'all') && (
                // Kirim setter function untuk menghitung total review proyek
                <ProjectTaskCardReview filters={filters} setReviewTotal={setProjectReviewTotal} />
              )}
            </>
          )}

          {activeTab === Tabs.approved && (
            <>
              {(filters?.kategori === 'tambahan' || filters?.kategori === 'all') && (
                <AdditionalTaskCard
                  filters={filters}
                  onProjectAdditionalDetailChange={onProjectAdditionalDetailChange}
                  selectedStaff={selectedStaff}
                  activeTab={Tabs.approved}
                />
              )}
              {(filters?.kategori === 'projects' || filters?.kategori === 'all') && (
                <ProjectTaskCard
                  filters={filters}
                  onProjectDetailChange={onProjectDetailChange}
                  selectedStaff={selectedStaff}
                  activeTab={Tabs.approved}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Daily;
