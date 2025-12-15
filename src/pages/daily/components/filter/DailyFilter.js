import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap';
import MaterialIcon from '@material/react-material-icon';
import './DailyFilter.scss';

const DailyFilter = ({ filters, onFilterChange, disableFilter }) => {
  // State untuk mengontrol apakah modal filter mobile terbuka atau tidak
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

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

  // Fungsi untuk merender daftar filter
  const renderFilterContent = () => (
    <div className="filter-list">
      {!disableFilter && (
        <>
          <div className="filter-group">
            <div className="filter-title">
              <span>Sort</span>
            </div>
            {['all', 'in progress', 'review', 'approved'].map((val) => (
              <div className="filter-item" key={val}>
                <input
                  type="radio"
                  id={`sort-${val}`}
                  name="sort"
                  checked={filters.sort === val}
                  onChange={() => onFilterChange('sort', val)}
                />
                <Label htmlFor={`sort-${val}`} className={filters.sort === val ? 'active' : ''}>
                  {val.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </Label>
              </div>
            ))}
          </div>
          {/* Garis pemisah untuk mobile */}
          <hr className="mobile-separator" />
        </>
      )}

      {/* KELOMPOK FILTER KEDUA: Kategori */}
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
              id={item.value}
              name="kategori"
              checked={filters.kategori === item.value}
              onChange={() => onFilterChange('kategori', item.value)}
            />
            {/* Perbaikan: Tambahkan class 'active' agar default terlihat */}
            <Label htmlFor={item.value} className={filters.kategori === item.value ? 'active' : ''}>
              {item.label}
            </Label>
          </div>
        ))}
      </div>
      {/* Garis pemisah untuk mobile */}
      <hr className="mobile-separator" />

      {/* KELOMPOK FILTER KETIGA: Tipe */}
      <div className="filter-group">
        <div className="filter-title">
          <span>Priority</span>
        </div>
        {['all', 'biasa', 'mendesak'].map((val) => (
          <div className="filter-item" key={val}>
            <input
              type="radio"
              id={`priority-${val}`}
              name="is_priority"
              checked={filters.is_priority === val}
              onChange={() => onFilterChange('is_priority', val)}
            />
            {/* Perbaikan: Tambahkan class 'active' agar default terlihat */}
            <Label
              htmlFor={`priority-${val}`}
              className={filters.is_priority === val ? 'active' : ''}
            >
              {val.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Label>

            {/* Perbaikan: Hapus span yang redundan */}
          </div>
        ))}
      </div>
      {/* Garis pemisah untuk mobile */}
      <hr className="mobile-separator" />

      {/* KELOMPOK FILTER KEEMPAT: Tahun */}
      <div className="filter-group">
        <div className="filter-title">
          <span>Tahun</span>
        </div>
        {years.map((year) => (
          <div className="filter-item" key={year}>
            <input
              type="radio"
              id={`tahun-${year}`}
              name="tahun"
              checked={filters?.tahun.toString() === year.toString()}
              onChange={() => onFilterChange('tahun', year)}
            />
            {/* Perbaikan: Ganti htmlFor agar cocok dengan ID input */}
            <Label htmlFor={`tahun-${year}`} className={filters.tahun === year ? 'active' : ''}>
              {year}
            </Label>
            {/* Perbaikan: Hapus span yang redundan */}
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
          value={Number(filters.bulan)}
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
  );

  return (
    <>
      {/* 1. Tombol Filter Mobile */}
      <button type="button" className="mobile-filter-button" onClick={toggleMobileFilter}>
        <MaterialIcon icon="filter_list" style={{ fontSize: 20 }} />
      </button>

      {/* 2. Popup Filter Mobile */}
      {isMobileFilterOpen && (
        <div className="mobile-filter-modal-overlay" onClick={toggleMobileFilter}>
          <div className="mobile-filter-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Filter</h3>
              <button type="button" className="close-button" onClick={toggleMobileFilter}>
                <MaterialIcon icon="close" style={{ fontSize: 24 }} />
              </button>
            </div>
            <div className="modal-body">{renderFilterContent()}</div>
            <div className="modal-footer">
              <button type="button" className="apply-button" onClick={toggleMobileFilter}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Filter Desktop */}
      <div className="daily-filter daily-filter-desktop">{renderFilterContent()}</div>
    </>
  );
};

// --- PROPTYPES ---
DailyFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    sort: PropTypes.string,
    kategori: PropTypes.string,
    is_priority: PropTypes.string,
    tahun: PropTypes.number,
    bulan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  disableFilter: PropTypes.bool,
};

DailyFilter.defaultProps = {
  filters: {
    sort: 'all',
    kategori: 'all',
    is_priority: 'all',
    tahun: new Date().getFullYear(),
    bulan: '',
  },
  disableFilter: false,
};

export default DailyFilter;
