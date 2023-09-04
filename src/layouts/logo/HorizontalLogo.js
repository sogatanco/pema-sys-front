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
          <img src={Logo} alt="" width="25" height="25" />
          <span style={{ color: 'white', 'font-size': '16px', fontWeight: 'bold' }}>PEMA</span>
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
