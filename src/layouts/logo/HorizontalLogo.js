import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
import { ReactComponent as LogoDarkIcon } from '../../assets/images/logos/dark-logo-icon.svg';
import { ReactComponent as LogoDarkText } from '../../assets/images/logos/dark-logo-text.svg';
import Logo from '../../assets/images/logos/pema-logo.png';

const HorizontalLogo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const activetopbarBg = useSelector((state) => state.customizer.topbarBg);
  return (
    <Link to="/" className="d-flex align-items-center gap-2">
      {isDarkMode || activetopbarBg !== 'white' ? (
        <>
          <img src={Logo} alt="" width="26" height="25" />
          <div className="d-none d-sm-flex gap-1">
            <span style={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>PEMA Sys </span>
            <span style={{ color: 'white', fontSize: '16px' }}>| Office</span>
          </div>
          {/* Show text on mobile */}
          <div className="d-flex d-sm-none gap-1">
            <span style={{ color: 'white', fontSize: '16px' }}>Office</span>
          </div>
        </>
      ) : (
        <>
          <LogoDarkIcon />
          <LogoDarkText className="d-none d-lg-block" />
        </>
      )}
    </Link>
  );
};

export default HorizontalLogo;
