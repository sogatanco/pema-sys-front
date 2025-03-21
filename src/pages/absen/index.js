import React from 'react';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import Absen from './Absen';

const Index = () => {

  const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '10px',
    transition: transitions.SCALE,
    containerStyle: {
      textTransform: 'none' // Hilangkan kapitalisasi
    }
  }

  return (
    <>
      <AlertProvider template={AlertTemplate} {...options}>
        <Absen />
      </AlertProvider>

    </>
  );
};

export default Index;
