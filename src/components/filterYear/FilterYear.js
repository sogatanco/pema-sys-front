import React, { useState } from 'react';
import './FilterYear.scss';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';

const FilterYear = ({ year, setYear }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate array tahun dari 2024 sampai tahun sekarang
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i).reverse();

  const handleSelectYear = (val) => {
    setYear(val);
    setIsOpen(false);
  };

  return (
    <div className="filter-year-container">
      {isOpen && (
        <div className="year-overlay" onClick={() => setIsOpen(false)}>
          hello
        </div>
      )}
      <div className="filter-year">
        <div className="label">
          <span>{year}</span>
        </div>
        <div className="button" onClick={() => setIsOpen(!isOpen)}>
          <MaterialIcon icon="keyboard_arrow_down" className="icon"></MaterialIcon>
        </div>

        {isOpen && (
          <>
            <div className="content">
              {years.map((val) => (
                <div className="item" key={val} onClick={() => handleSelectYear(val)}>
                  {val}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

FilterYear.propTypes = {
  year: PropTypes.number,
  setYear: PropTypes.func,
};

export default FilterYear;
