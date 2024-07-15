import React, { useEffect, useRef, useState } from 'react';
import './QrCode.scss';
import MaterialIcon from '@material/react-material-icon';
import { QRCode } from 'react-qrcode-logo';
import { toPng } from 'html-to-image';
import squaresPattern from '../../assets/images/qrcode/squares.jpg';
import fluidPattern from '../../assets/images/qrcode/fluid.jpg';
import dotsPattern from '../../assets/images/qrcode/dots.jpg';
import logo from '../../assets/images/qrcode/qr-code-logo.png';

const QrCodeGenerator = () => {
  const [logoIsChecked, setLogoIsChecked] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('squares');
  const [eyeRadius, setEyeRadius] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#0f0f0f');
  const [urlValue, setUrlValue] = useState('');
  const [error, setError] = useState(false);

  const elementRef = useRef(null);

  const htmlToImageConvert = () => {
    if (urlValue !== '') {
      toPng(elementRef.current, { cacheBust: false }).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'pemasys-qrcode.png';
        link.href = dataUrl;
        link.click();
      });
      setError(false);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (urlValue !== '') {
      setError(false);
    }
  }, [urlValue]);

  return (
    <div className="qr-container">
      <div className="qr-body">
        <div className="qr-left">
          <div className="frame" ref={elementRef} style={{ border: `2px solid ${selectedColor}` }}>
            <QRCode
              value={urlValue}
              size={275}
              qrStyle={selectedPattern}
              eyeRadius={eyeRadius ? 10 : 0}
              fgColor={selectedColor}
              quietZone={5}
              logoImage={logoIsChecked ? logo : ''}
            />
          </div>
          <input
            type="text"
            placeholder="Type Url.."
            onChange={(e) => setUrlValue(e.target.value)}
          />
          <div className="text-center">
            {error ? <span style={{ color: 'red' }}>Please enter url!</span> : <span> </span>}
          </div>
        </div>
        <div className="qr-right">
          <div className="pattern">
            <span>Pattern</span>
            <div className="pattern-item">
              <div onClick={() => setSelectedPattern('squares')}>
                {selectedPattern === 'squares' && (
                  <div className="checked-mark">
                    <MaterialIcon icon="check" />
                  </div>
                )}
                <img src={squaresPattern} alt="squares" width="60" height="60" />
              </div>
              <div onClick={() => setSelectedPattern('fluid')}>
                {selectedPattern === 'fluid' && (
                  <div className="checked-mark">
                    <MaterialIcon icon="check" />
                  </div>
                )}
                <img src={fluidPattern} alt="squares" width="60" height="60" />
              </div>
              <div onClick={() => setSelectedPattern('dots')}>
                {selectedPattern === 'dots' && (
                  <div className="checked-mark">
                    <MaterialIcon icon="check" />
                  </div>
                )}
                <img src={dotsPattern} alt="squares" width="60" height="60" />
              </div>
            </div>
          </div>
          <div className="pattern">
            <span>Color</span>
            <div className="pattern-item">
              <div onClick={() => setSelectedColor('#0f0f0f')} className="color-1">
                {selectedColor === '#0f0f0f' && (
                  <div className="checked-mark">
                    <MaterialIcon icon="check" />
                  </div>
                )}
              </div>
              <div onClick={() => setSelectedColor('#0c69c7')} className="color-2">
                {selectedColor === '#0c69c7' && (
                  <div className="checked-mark">
                    <MaterialIcon icon="check" />
                  </div>
                )}
              </div>
              <div onClick={() => setSelectedColor('#5DCF8B')} className="color-3">
                {selectedColor === '#5DCF8B' && (
                  <div className="checked-mark">
                    <MaterialIcon icon="check" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="qr-radio" onClick={() => setLogoIsChecked(!logoIsChecked)}>
            <div className={`logo-check ${logoIsChecked && 'isChecked'}`}>
              {logoIsChecked && <MaterialIcon icon="check" />}
            </div>
            <span>Logo Pema</span>
          </div>
          <div className="qr-radio" onClick={() => setEyeRadius(!eyeRadius)}>
            <div className={`logo-check ${eyeRadius && 'isChecked'}`}>
              {eyeRadius && <MaterialIcon icon="check" />}
            </div>
            <span>Eye Radius</span>
          </div>
          <div className="btn-download">
            <button type="button" onClick={htmlToImageConvert}>
              Download Qr Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
