import React from 'react';
import PropTypes from 'prop-types';

const FetchingFile = ({ progress }) => {
  return (
    <div
      style={{
        padding: '4px 20px',
        borderRadius: '5px',
        backgroundColor: '#B9B9B9',
        color: 'white',
        position: 'relative',
        // hover
        '&:hover': {
          color: 'white',
        },
        overflow: 'hidden',
        width: 'max-content',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#21C1D6',
          transition: 'width 0.5s ease-in-out',
        }}
      />
      <span style={{ position: 'relative', fontWeight: 'normal', color: 'white' }}>
        Loading preview..
      </span>
    </div>
  );
};

FetchingFile.propTypes = {
  progress: PropTypes.number,
};

export default FetchingFile;
