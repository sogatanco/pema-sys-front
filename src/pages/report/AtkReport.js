import React from 'react';
import JotformEmbed from 'react-jotform-embed';
import './Report.scss';

const AtkReport = () => {
  return (
    <div
      className=""
      style={{ width: '100vw', height: '1000px', position: 'relative', backgroundColor: 'green' }}
    >
      <div
        className=""
        style={{ position: 'absolute', top: '0', zIndex: '0', width: '100%', height: '100%' }}
      >
        <JotformEmbed src="https://www.jotform.com/tables/233041253562043" />
      </div>
    </div>
  );
};

export default AtkReport;
