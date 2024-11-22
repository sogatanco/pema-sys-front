import PropTypes from 'prop-types';
import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import logo from '../../../assets/images/qrcode/qr-code-logo.png';

const QrCodeSurat = ({ dataSurat }) => {
  const baseURL1 = process.env.REACT_APP_FRONTEND;
  return (

      <QRCode
        value={`${baseURL1}verification/${dataSurat?.doc_number}`}
        size={400}
        qrStyle="dots"
        logoImage={logo} // Ganti dengan URL logo kamu
        logoWidth={100}
        logoHeight={100}
        eyeRadius={20}
        fgColor="#0F52BA"
      />
  );
};

QrCodeSurat.propTypes = {
  dataSurat: PropTypes.any,
};

export default QrCodeSurat;
