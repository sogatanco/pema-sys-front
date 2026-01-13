import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import TaskCard from './components/taskCard/TaskCard';
import useAxios from '../../hooks/useAxios';
import TaskReviewAdditional from './components/taskReviewAdditional/TaskReviewAdditional';

const AdditionalTaskCard = ({ filters, onProjectAdditionalDetailChange }) => {
  const api = useAxios();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tambahan-list', filters],
    queryFn: () =>
      api
        .get(
          `api/module/daily/by-category/tambahan?year=${filters?.tahun}&month=${
            filters?.bulan
          }&category=${(filters.kategori === 'all' ? '' : filters.kategori) || ''}&sort=${
            (filters?.sort === 'all' ? '' : filters?.sort) || ''
          }&is_priority=${
            (filters?.is_priority === 'all'
              ? ''
              : filters?.is_priority === 'mendesak'
              ? 'true'
              : 'false') || ''
          }&employe_id=${filters?.employe_id}`,
        )
        .then((res) => {
          return res.data;
        }),
  });

  useEffect(() => {
    onProjectAdditionalDetailChange({
      totalAdditional: data?.total || 0,
    });
  }, [data, filters]);

  return isLoading ? (
    <div>Loading...</div>
  ) : error ? (
    <div>Error: {error.message}</div>
  ) : (
    <div className="daily-card">
      {(filters.kategori === 'all' || filters.kategori === 'tambahan') && (
        <TaskCard title="Tugas Tambahan" task={data?.data} refetch={refetch} category="tambahan" />
      )}

      {data?.data?.daily_review && data.data.daily_review.length > 0 && (
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

          <TaskReviewAdditional task={data?.data} title="Review Tugas Tambahan" refetch={refetch} />
        </>
      )}
    </div>
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
};

export default AdditionalTaskCard;
