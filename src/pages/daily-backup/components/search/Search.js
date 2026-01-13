import React from 'react';
import PropTypes from 'prop-types';
import './Search.scss';

const Search = ({ value, onChange }) => {
  return (
    <div className="search-container">
      <input type="text" placeholder="Cari Task..." value={value} onChange={onChange} />
    </div>
  );
};

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Search;
