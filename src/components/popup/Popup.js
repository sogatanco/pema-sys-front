import React from 'react';
import PropTypes from 'prop-types';
import './Popup.scss';
import MaterialIcon from '@material/react-material-icon';

const Popup = ({ isOpen, togglePopup, title, children, closeButton }) => {
  return (
    isOpen && (
      <>
        <div className="popup-container">
          <div className="popup-overlay"></div>
          <div className="popup">
            <h6 className="fw-bold">{title}</h6>
            {(closeButton || closeButton === undefined) && (
              <div className="popup-close">
                <MaterialIcon icon="close" onClick={() => togglePopup()} />
              </div>
            )}
            <hr style={{ marginTop: '0px' }} />
            {children}
          </div>
        </div>
      </>
    )
  );
};

Popup.propTypes = {
  isOpen: PropTypes.bool,
  togglePopup: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  closeButton: PropTypes.bool,
};

export default Popup;
