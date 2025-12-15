import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import Timeline from './components/timeline/Timeline';
import Search from './components/search/Search';
import Button from './components/button/Button';
import TaskCard from './components/taskCard/TaskCard';
import TaskReview from './components/taskReview/TaskReview';
import FilterDropdown from './components/filterDropdown/FilterDropdown';

const ProjectTaskCard = ({ filters, onProjectDetailChange }) => {
  // const auth = JSON.parse(localStorage.getItem('auth'));
  const api = useAxios();

  const [searchQueries, setSearchQueries] = useState({});

  // STATE PAGINATION PER TASK
  const [pageByTask, setPageByTask] = useState({});

  // STATE UNTUK FILTER DROPDOWN
  const [filterVisibility, setFilterVisibility] = useState({});
  const [taskFilters, setTaskFilters] = useState({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['daily-list-all', filters],

    queryFn: async () => {
      const res = await api.get(
        `api/daily/list-by-employee?year=${filters?.tahun}&month=${filters?.bulan}&category=${
          (filters?.kategori === 'all' ? '' : filters?.kategori) || ''
        }&type=${(filters?.tipe === 'all' ? '' : filters?.tipe) || ''}&sort=${
          (filters?.sort === 'all' ? '' : filters?.sort) || ''
        }&is_priority=${
          (filters?.is_priority === 'mendesak' && 'true') ||
          (filters?.is_priority === 'biasa' && 'false') ||
          ''
        }&employe_id=${filters?.employe_id}`,
      );
      return res.data;
    },
  });

  useEffect(() => {
    onProjectDetailChange({
      totalProject: data?.total || 0,
      totalDaily: data?.total_daily || 0,
      formattedEmploye: data?.formattedEmploye,
    });
  }, [data, filters]);

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data?.data?.map((project) => {
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

      return {
        ...project,
        project_task: filteredTasks,
        project_review: filteredReviews,
      };
    });
  }, [data, searchQueries, filters, taskFilters]); // taskFilters tetap di dependency list, walau tidak digunakan di logic

  const handleSearchChange = (projectId, value) => {
    setSearchQueries((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  // Helper untuk toggle visibilitas filter
  const toggleFilter = (projectId) => {
    setFilterVisibility((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  // Helper untuk menyimpan nilai filter (meskipun nilai ini tidak digunakan untuk filter data saat ini)
  const handleFilterChange = (projectId, filterName, value) => {
    setTaskFilters((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [filterName]: value,
      },
    }));

    // Sembunyikan filter setelah memilih
    setFilterVisibility((prev) => ({
      ...prev,
      [projectId]: false,
    }));
  };

  // Helper set page
  const setPage = (taskId, page) => {
    setPageByTask((prev) => ({
      ...prev,
      [taskId]: page,
    }));
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        filteredData.map((item) => (
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

              <div className="header-action position-relative">
                <Search
                  value={searchQueries[item.project_id] || ''}
                  onChange={(e) => handleSearchChange(item.project_id, e.target.value)}
                />
                <Button
                  actionFn={() => toggleFilter(item.project_id)}
                  color="grey"
                  icon="filter_list"
                />
                {/* FilterDropdown */}
                {filterVisibility[item.project_id] && (
                  <FilterDropdown
                    projectId={item.project_id}
                    currentStatus={taskFilters[item.project_id]?.status || 'all'}
                    onStatusChange={handleFilterChange}
                  />
                )}
              </div>
            </div>

            <div className="card-body">
              {item.project_task.length === 0 && item.project_review.length === 0 ? (
                <div className="text-gray-500 italic p-2 text-center">Tidak ada task.</div>
              ) : (
                <>
                  {item.project_task.map((task) => {
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
                                className={`page-item ${
                                  currentPage === totalPage ? 'disabled' : ''
                                }`}
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
                  })}

                  {item?.project_review?.length > 0 && (
                    <>
                      <div
                        className="alert alert-info d-flex align-items-center justify-content-center mb-3 shadow-sm border-0 rounded-3"
                        role="alert"
                        style={{
                          backgroundColor: '#e9f3ff',
                          color: '#0c5460',
                        }}
                      >
                        <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                        <strong>Need To Review</strong>
                      </div>

                      {item?.project_review?.map((task) => (
                        <TaskReview
                          key={task.task_id}
                          task={task}
                          category="rutin"
                          refetch={refetch}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
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
};

export default ProjectTaskCard;
