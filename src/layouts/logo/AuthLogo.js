import React from 'react';
import { useSelector } from 'react-redux';

// import { ReactComponent as LogoDarkIcon } from '../../assets/images/logos/dark-logo-icon.svg';
// import { ReactComponent as LogoDarkText } from '../../assets/images/logos/dark-logo-text.svg';
// import { ReactComponent as LogoWhiteIcon } from '../../assets/images/logos/white-logo-icon.svg';
// import { ReactComponent as LogoWhiteText } from '../../assets/images/logos/white-logo-text.svg';
import Logo from '../../assets/images/logos/pema-logo.png';

const AuthLogo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);

  return (
    <div className="p-4 d-flex justify-content-center align-items-end gap-2">
      {isDarkMode !== false ? (
        <>
          <img src={Logo} alt="logo" width="40" height="40" />
          {/* <LogoWhiteIcon />
          <LogoWhiteText /> */}
        </>
      ) : (
        <>
          <img src={Logo} alt="logo" width="75" height="75" />
          <div className="d-flex flex-column">
            <h1 className="fw-bold">PEMA-Sys</h1>
            <div className="d-flex justify-content-end" style={{ marginTop: '-10px' }}>
              <small className="text-danger">Beta Version</small>
            </div>
          </div>
          {/* <LogoDarkIcon /> */}
          {/* <LogoDarkText /> */}
        </>
      )}
    </div>
  );
};

export default AuthLogo;
