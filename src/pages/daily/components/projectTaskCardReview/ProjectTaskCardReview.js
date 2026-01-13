import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../../hooks/useAxios';
import Button from '../button/Button';
import Search from '../search/Search';
import Timeline from '../timeline/Timeline';
import TaskCardReview from '../taskCardReview/TaskCardReview';
import './ProjectTaskCardReview.scss';

const ProjectTaskCardReview = ({ filters, setReviewTotal }) => {
  const api = useAxios();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['daily-review', filters],

    queryFn: async () => {
      const res = await api.get(
        `api/daily/review-list?year=${filters?.tahun}&month=${filters?.bulan}&category=${
          (filters?.kategori === 'all' ? '' : filters?.kategori) || ''
        }&type=${(filters?.tipe === 'all' ? '' : filters?.tipe) || ''}&is_priority=${
          (filters?.is_priority === 'mendesak' && 'true') ||
          (filters?.is_priority === 'biasa' && 'false') ||
          ''
        }`,
      );

      const totalReviews = res.data?.data?.length || 0; // Hitung item level Project/Task

      // Panggil setter function yang dikirim dari Daily.js
      if (setReviewTotal) {
        setReviewTotal(totalReviews);
      }

      return res.data.data;
    },
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (data) {
      const query = searchQuery.toLowerCase().trim();

      if (query.length === 0) {
        setFilteredData(data);
        return;
      }

      const searchedData = data.map((project) => {
        // Filter tasks HANYA berdasarkan task_title
        const filteredTasks = project.project_review.filter((task) =>
          task.task_title.toLowerCase().includes(query),
        );

        return {
          ...project,
          project_review: filteredTasks,
        };
      });

      setFilteredData(searchedData);
    }
  }, [data, searchQuery]);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

  const hasProjectData = data && data.length > 0;
  const isSearchActive = searchQuery.length > 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!hasProjectData && !isSearchActive) {
    return <div className="text-gray-500 italic p-2 text-center">Tidak ada project Review</div>;
  }

  return (
    <>
      {filteredData?.map((item) => (
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

            <div className="header-action">
              <div className="search-desktop">
                <Search
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Cari Task..."
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
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari Task..."
              />
            </div>
          )}

          <div className="card-body">
            <div className="card-body">
              {item?.project_review?.length === 0 ? (
                // PERBAIKAN ESLINT DI SINI: Menggunakan tanda kutip tunggal (')
                <div className="p-2 text-center text-gray-500 italic">Tidak ada task Review</div>
              ) : (
                item?.project_review.map((task) => {
                  return (
                    <TaskCardReview
                      key={task.task_id}
                      task={{ ...task }}
                      category="non-rutin"
                      refetch={refetch}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

ProjectTaskCardReview.propTypes = {
  filters: PropTypes.shape({
    bulan: PropTypes.string,
    tahun: PropTypes.string,
    kategori: PropTypes.string,
    is_priority: PropTypes.string,
    tipe: PropTypes.string,
  }),
  setReviewTotal: PropTypes.func,
};

export default ProjectTaskCardReview;
