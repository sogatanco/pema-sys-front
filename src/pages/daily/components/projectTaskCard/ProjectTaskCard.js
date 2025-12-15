import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../../hooks/useAxios';
import Button from '../button/Button';
import Search from '../search/Search';
import './ProjectTaskCard.scss';
import Timeline from '../timeline/Timeline';
import TaskCard from '../taskCard/TaskCard';

const ProjectTaskCard = ({ filters, onProjectDetailChange, selectedStaff, activeTab }) => {
  const api = useAxios();
  const [pageByTask, setPageByTask] = useState({});
  const [searchQueries, setSearchQueries] = useState({});

  let path = '';
  let params = '';
  if (activeTab === 'approved') {
    path = 'api/daily/list-by-employee/approved-list';
    params = `year=${filters?.tahun}&month=${filters?.bulan}&category=${
      (filters.kategori === 'all' ? '' : filters.kategori) || ''
    }&is_priority=${
      (filters?.is_priority === 'all'
        ? ''
        : filters?.is_priority === 'mendesak'
        ? 'true'
        : 'false') || ''
    }`;
  }

  if (activeTab === 'dailies') {
    path = 'api/daily/list-by-employee';
    params = `year=${filters?.tahun}&month=${filters?.bulan}&category=${
      (filters?.kategori === 'all' ? '' : filters?.kategori) || ''
    }&type=${(filters?.tipe === 'all' ? '' : filters?.tipe) || ''}&sort=${
      (filters?.sort === 'all' ? '' : filters?.sort) || ''
    }&is_priority=${
      (filters?.is_priority === 'mendesak' && 'true') ||
      (filters?.is_priority === 'biasa' && 'false') ||
      ''
    }&employe_id=${filters?.employe_id}`;
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['daily-list-all', filters],

    queryFn: async () => {
      const res = await api.get(`${path}?${params}`);
      return res.data;
    },
  });

  const filteredData = useMemo(() => {
    if (!data) return { projects: [], totalDaily: 0 }; // <--- Modifikasi: Kembalikan objek

    let totalDailyCount = 0; // 1. Inisialisasi penghitung total

    const projects = data?.data?.map((project) => {
      const searchValue = (searchQueries[project.project_id] || '').toLowerCase();

      let filteredTasks = project.project_task || [];
      let filteredReviews = project.project_review || [];

      if (searchValue) {
        filteredTasks = filteredTasks.filter((task) =>
          task.task_title?.toLowerCase().includes(searchValue),
        );

        filteredReviews = filteredReviews.filter((review) =>
          review.task_title?.toLowerCase().includes(searchValue),
        );
      }

      // 2. Jumlahkan total_daily_count dari task yang sudah difilter
      const projectDailyCount = filteredTasks.reduce((sum, task) => {
        return sum + (task.total_daily_count || 0);
      }, 0);

      totalDailyCount += projectDailyCount; // 3. Tambahkan ke total keseluruhan

      return {
        ...project,
        project_task: filteredTasks,
        project_review: filteredReviews,
        // Opsional: Sertakan total daily di level Project (berdasarkan data yang difilter)
        // total_daily_filtered: projectDailyCount,
      };
    });

    // 4. Kembalikan data Project yang difilter dan total daily yang dihitung
    return {
      projects,
      totalDaily: totalDailyCount,
    };
  }, [data, searchQueries, filters]);

  // State untuk mengontrol visibilitas search mobile
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Fungsi untuk mengubah state (membuka/menutup search)
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

  const handleSearchChange = (projectId, value) => {
    setSearchQueries((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  const setPage = (taskId, page) => {
    setPageByTask((prev) => ({
      ...prev,
      [taskId]: page,
    }));
  };

  useEffect(() => {
    onProjectDetailChange({
      totalProject: data?.total || 0, // Menggunakan total Project dari response API
      totalDaily: filteredData?.totalDaily || 0, // <--- Ambil total yang dihitung
      formattedEmploye: data?.formattedEmploye,
    });
  }, [data, filters, filteredData]);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : filteredData.length === 0 ? (
        <div className="text-gray-500 italic p-2 text-center">Tidak ada project.</div>
      ) : (
        filteredData?.projects?.map((item) => (
          <div className="daily-card project mb-3" key={item.project_id}>
            <div className="card-header">
              <div className="header-title">
                <h4>{item.project_name}</h4>
                <div className="title-attribute">
                  <Timeline dateRange={item.date_range} isLate={item.is_late} />
                  <div className="attribute-item">
                    <span>{item.total_task}</span>
                    <span>Task</span>
                  </div>
                </div>
              </div>

              {/* Bagian Kanan: Actions */}
              <div className="header-action">
                <div className="search-desktop">
                  <Search
                    value={searchQueries[item.project_id] || ''}
                    onChange={(e) => handleSearchChange(item.project_id, e.target.value)}
                  />
                </div>

                <div className="search-mobile-icon">
                  <Button
                    color="grey"
                    icon={isMobileSearchOpen ? 'close' : 'search'} // Ganti ikon
                    type="button"
                    actionFn={() => toggleMobileSearch()}
                  />
                </div>
                {/* <Button color="grey" icon="filter_list" type="button" /> */}
              </div>
            </div>
            {/* Kontainer Search Mobile */}
            {isMobileSearchOpen && (
              <div className="mobile-search-bar">
                <Search
                  value={searchQueries[item.project_id] || ''}
                  onChange={(e) => handleSearchChange(item.project_id, e.target.value)}
                />
              </div>
            )}
            <div className="card-body">
              {item?.project_task?.length === 0 ? (
                <div className="p-2 text-center">Tidak ada task.</div>
              ) : (
                item?.project_task.map((task) => {
                  const daily = task.daily || [];
                  const perPage = 5;
                  const totalPage = Math.ceil(daily.length / perPage);

                  const currentPage = pageByTask[task.task_id] || 1;

                  const start = (currentPage - 1) * perPage;
                  const end = start + perPage;

                  const paginatedDaily = daily.slice(start, end);

                  return (
                    <React.Fragment key={task.task_id}>
                      <TaskCard
                        task={{ ...task, daily: paginatedDaily }}
                        category="non-rutin"
                        refetch={refetch}
                        selectedStaff={selectedStaff}
                        activeTab={activeTab}
                      />

                      {/* PAGINATION */}
                      {totalPage > 1 && (
                        <nav className="d-flex justify-content-end mb-2" style={{ zIndex: '0' }}>
                          <ul className="pagination pagination-sm">
                            {/* Prev */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                type="button"
                                className="page-link"
                                onClick={() => setPage(task.task_id, currentPage - 1)}
                              >
                                &laquo;
                              </button>
                            </li>

                            {/* Page numbers */}
                            {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
                              <li
                                key={page}
                                className={`page-item ${page === currentPage ? 'active' : ''}`}
                                style={{ zIndex: '0' }}
                              >
                                <button
                                  type="button"
                                  className="page-link"
                                  onClick={() => setPage(task.task_id, page)}
                                >
                                  {page}
                                </button>
                              </li>
                            ))}

                            {/* Next */}
                            <li
                              className={`page-item ${currentPage === totalPage ? 'disabled' : ''}`}
                            >
                              <button
                                type="button"
                                className="page-link"
                                onClick={() => setPage(task.task_id, currentPage + 1)}
                              >
                                &raquo;
                              </button>
                            </li>
                          </ul>
                        </nav>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        ))
      )}
    </>
  );
};

ProjectTaskCard.propTypes = {
  filters: PropTypes.shape({
    sort: PropTypes.string,
    tahun: PropTypes.number,
    bulan: PropTypes.number,
    kategori: PropTypes.string,
    is_priority: PropTypes.string,
    tipe: PropTypes.string,
    employe_id: PropTypes.string,
  }),
  onProjectDetailChange: PropTypes.func.isRequired,
  selectedStaff: PropTypes.object,
  activeTab: PropTypes.string,
};

export default ProjectTaskCard;
