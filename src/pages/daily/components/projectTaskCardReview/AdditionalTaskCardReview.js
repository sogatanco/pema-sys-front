import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../../../hooks/useAxios';
import Button from '../button/Button';
import Search from '../search/Search';
import Timeline from '../timeline/Timeline';
import TaskCardReview from '../taskCardReview/TaskCardReview';
import './ProjectTaskCardReview.scss';

const AdditionalTaskCardReview = ({ filters, setReviewTotal }) => {
  const api = useAxios();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const { data, refetch } = useQuery({
    queryKey: ['additional-review', filters],

    queryFn: async () => {
      const res = await api.get(
        `api/daily/additional-review-list?year=${filters?.tahun}&month=${filters?.bulan}&category=${
          (filters?.kategori === 'all' ? '' : filters?.kategori) || ''
        }&is_priority=${
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

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
  };

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
                <Search />
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
              <Search />
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

AdditionalTaskCardReview.propTypes = {
  filters: PropTypes.shape({
    bulan: PropTypes.string,
    tahun: PropTypes.string,
    kategori: PropTypes.string,
    is_priority: PropTypes.string,
    tipe: PropTypes.string,
  }),
  setReviewTotal: PropTypes.func,
};

export default AdditionalTaskCardReview;
