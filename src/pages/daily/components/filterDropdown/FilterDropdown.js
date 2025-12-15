import React from 'react';

const FilterDropdown = () => {
  return (
    <div
      className="filter-dropdown position-absolute bg-white p-2 rounded-3 border mt-2"
      style={{
        zIndex: 1,
        top: '100%',
        right: 0,
        minWidth: '180px',
      }}
    >
      <div className="d-grid gap-1">
        <button type="button" className="btn btn-sm btn-success">
          Semua Task
        </button>
        <button type="button" className="btn btn-sm btn-light">
          Review
        </button>
        <button type="button" className="btn btn-sm btn-light">
          In Progress
        </button>
        <button type="button" className="btn btn-sm btn-light">
          Approved
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
