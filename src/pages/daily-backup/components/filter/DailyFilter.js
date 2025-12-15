/* eslint-disable react/prop-types */
import React from 'react';

const DailyFilter = ({ filters, onFilterChange }) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1];

  const month = [
    { label: 'Januari', value: 1 },
    { label: 'Februari', value: 2 },
    { label: 'Maret', value: 3 },
    { label: 'April', value: 4 },
    { label: 'Mei', value: 5 },
    { label: 'Juni', value: 6 },
    { label: 'Juli', value: 7 },
    { label: 'Agustus', value: 8 },
    { label: 'September', value: 9 },
    { label: 'Oktober', value: 10 },
    { label: 'November', value: 11 },
    { label: 'Desember', value: 12 },
  ];
  return (
    <div className="daily-filter">
      <div className="filter-list">
        {/* SORT */}
        <div className="filter-group">
          <div className="filter-title">
            <span>Sort</span>
          </div>
          {['all', 'in progress', 'review', 'approved'].map((val) => (
            <div className="filter-item" key={val}>
              <input
                type="radio"
                name="sort"
                checked={filters.sort === val}
                onChange={() => onFilterChange('sort', val)}
              />
              <span>{val.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
            </div>
          ))}
        </div>

        {/* KATEGORI */}
        <div className="filter-group">
          <div className="filter-title">
            <span>Kategori</span>
          </div>
          {[
            { value: 'all', label: 'All' },
            { value: 'tambahan', label: 'Tambahan' },
            { value: 'projects', label: 'Proyek/Proker' },
          ].map((item) => (
            <div className="filter-item" key={item.value}>
              <input
                type="radio"
                name="kategori"
                checked={filters.kategori === item.value}
                onChange={() => onFilterChange('kategori', item.value)}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* PRIORITAS */}
        <div className="filter-group">
          <div className="filter-title">
            <span>Priority</span>
          </div>
          {['all', 'biasa', 'mendesak'].map((val) => (
            <div className="filter-item" key={val}>
              <input
                type="radio"
                name="is_priority"
                checked={filters.is_priority === val}
                onChange={() => onFilterChange('is_priority', val)}
              />
              <span>{val.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
            </div>
          ))}
        </div>

        {/* TIPE */}
        {/* <div className="filter-group">
          <div className="filter-title">
            <span>Tipe</span>
          </div>
          {['all', 'rutin', 'non-rutin', 'bulanan'].map((val) => (
            <div className="filter-item" key={val}>
              <input
                type="radio"
                name="tipe"
                checked={filters.tipe === val}
                onChange={() => onFilterChange('tipe', val)}
              />
              <span>{val.charAt(0).toUpperCase() + val.slice(1)}</span>
            </div>
          ))}
        </div> */}

        {/* TAHUN */}
        <div className="filter-group">
          <div className="filter-title">
            <span>Tahun</span>
          </div>
          {years.map((year) => (
            <div className="filter-item" key={year}>
              <input
                type="radio"
                name="tahun"
                checked={filters.tahun === year.toString()}
                onChange={() => onFilterChange('tahun', year.toString())}
              />
              <span>{year}</span>
            </div>
          ))}
        </div>

        {/* BULAN */}
        <div className="filter-group">
          <div className="filter-title">
            <span>Bulan</span>
          </div>

          <select
            className="filter-select"
            value={filters.bulan}
            onChange={(e) => onFilterChange('bulan', e.target.value)}
          >
            <option value="">All</option>
            {month.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default DailyFilter;
