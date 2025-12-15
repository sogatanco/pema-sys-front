import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import Button from '../button/Button';
import Search from '../search/Search';
import TaskCard from '../taskCard/TaskCard';
import useAxios from '../../../../hooks/useAxios';
import './AdditionalTaskCard.scss';

const ITEMS_PER_PAGE = 5;

const AdditionalTaskCard = ({
  filters,
  onProjectAdditionalDetailChange,
  selectedStaff,
  activeTab,
}) => {
  const api = useAxios();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  let path = '';
  let params = '';
  if (activeTab === 'approved') {
    path = 'api/daily/tambahan/approved-list';
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
    path = 'api/module/daily/by-category/tambahan';
    params = `year=${filters?.tahun}&month=${filters?.bulan}&category=${
      (filters.kategori === 'all' ? '' : filters.kategori) || ''
    }&sort=${(filters?.sort === 'all' ? '' : filters?.sort) || ''}&is_priority=${
      (filters?.is_priority === 'all'
        ? ''
        : filters?.is_priority === 'mendesak'
        ? 'true'
        : 'false') || ''
    }&employe_id=${filters?.employe_id}`;
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tambahan-list', filters],
    queryFn: () =>
      api.get(`${path}?${params}`).then((res) => {
        return res.data;
      }),
  });

  // Reset page ke 1 saat filter atau search query berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  useEffect(() => {
    onProjectAdditionalDetailChange({
      totalAdditional: data?.total || 0,
    });
  }, [data, filters, onProjectAdditionalDetailChange]);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  // --- Logika Filtering dan Pagination ---
  const processedData = useMemo(() => {
    if (!data?.data) return { paginatedDaily: [], totalPages: 0 };

    const taskData = data.data;

    // 1. Filtering (Berdasarkan activity_name di dalam array daily)
    const filteredDaily =
      taskData?.daily?.filter((activity) => {
        const searchLower = searchQuery.toLowerCase();
        return activity.activity_name?.toLowerCase().includes(searchLower);
      }) || [];

    // 2. Pagination
    const totalItems = filteredDaily.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const paginatedDaily = filteredDaily.slice(start, end);

    // Memperbaiki ESLint error object-shorthand di baris ini
    return {
      taskData,
      paginatedDaily,
      totalPages,
    };
  }, [data, searchQuery, currentPage]);

  const { taskData, paginatedDaily, totalPages } = processedData;
  const taskToDisplay = useMemo(
    () => ({
      ...taskData,
      daily: paginatedDaily,
    }),
    [taskData, paginatedDaily],
  );

  // --- Fungsi Pagination ---
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          {/* Tambahkan class untuk sticky header di CSS .card-header mobile */}
          {(filters.kategori === 'all' || filters.kategori === 'tambahan') && (
            <div className="daily-card project mb-3">
              <div className="card-header">
                <div className="header-title">
                  <h4>Tugas Tambahan</h4>
                </div>

                <div className="header-action">
                  <div className="search-desktop">
                    <Search
                      value={searchQuery || ''}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>

                  <div className="search-mobile-icon">
                    <Button
                      color="grey"
                      icon={isMobileSearchOpen ? 'close' : 'search'}
                      type="button"
                      actionFn={() => toggleMobileSearch()}
                    />
                  </div>
                  {/* <Button color="grey" icon="filter_list" type="button" /> */}
                </div>
              </div>

              {isMobileSearchOpen && (
                <div className="mobile-search-bar">
                  <Search
                    value={searchQuery || ''}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              )}

              <div className="card-body">
                {(filters.kategori === 'all' || filters.kategori === 'tambahan') && (
                  <>
                    <TaskCard
                      title="Tugas Tambahan"
                      task={taskToDisplay}
                      refetch={refetch}
                      category="tambahan"
                      selectedStaff={selectedStaff}
                      activeTab={activeTab}
                    />

                    {/* --- PAGINATION CONTROLS --- */}
                    {totalPages > 1 && (
                      <nav className="d-flex justify-content-end mb-2">
                        <ul className="pagination pagination-sm">
                          {/* Prev */}
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              type="button"
                              className="page-link"
                              onClick={() => handlePageChange(currentPage - 1)}
                            >
                              &laquo;
                            </button>
                          </li>

                          {/* Page numbers */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <li
                              key={page}
                              className={`page-item ${page === currentPage ? 'active' : ''}`}
                              style={{ zIndex: '0' }}
                            >
                              <button
                                type="button"
                                className="page-link"
                                onClick={() => handlePageChange(page)}
                              >
                                {page}
                              </button>
                            </li>
                          ))}

                          {/* Next */}
                          <li
                            className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
                          >
                            <button
                              type="button"
                              className="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
                            >
                              &raquo;
                            </button>
                          </li>
                        </ul>
                      </nav>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

AdditionalTaskCard.propTypes = {
  filters: PropTypes.shape({
    sort: PropTypes.string,
    tahun: PropTypes.number,
    bulan: PropTypes.number,
    kategori: PropTypes.string,
    is_priority: PropTypes.string,
    tipe: PropTypes.string,
    status: PropTypes.string,
    employe_id: PropTypes.string,
  }),
  onProjectAdditionalDetailChange: PropTypes.func,
  selectedStaff: PropTypes.object,
  activeTab: PropTypes.string,
};

export default AdditionalTaskCard;
