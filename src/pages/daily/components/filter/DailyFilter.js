import React from 'react';

const DailyFilter = () => {
  return (
    <div className="daily-filter">
      <div className="filter-list">
        <div className="filter-group">
          <div className="filter-title">
            <span>Sort</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?">In Progress</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?">Review</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?">Done</span>
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-title">
            <span>Kategori</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?"> Tambahan</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?"> Proyek/Proker</span>
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-title">
            <span>Tipe</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?">Rutin</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?">Non-rutin</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?">Bulanan</span>
          </div>
        </div>
        <div className="filter-group">
          <div className="filter-title">
            <span>Tahun</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?">2025</span>
          </div>
          <div className="filter-item">
            <input type="radio"></input>
            <span htmlFor="?">2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyFilter;
