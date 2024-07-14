import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFFile from './PDFFile';

const Report = () => {
  return (
    <PDFDownloadLink document={<PDFFile />} fileName="hhuhhahah">
      {({ loading }) =>
        loading ? (
          <button type="button">Loading Document...</button>
        ) : (
          <button type="button">Download</button>
        )
      }
    </PDFDownloadLink>
  );
};

export default Report;
