import React from 'react';
import PropTypes from 'prop-types';
import './Popup.scss';
import { Spinner } from 'reactstrap';

const PopupConfirmation = ({ isOpen, loading, handleConfirm, toggle, title, message, btnType }) => {
  return (
    isOpen && (
      <>
        <div className="popup-container">
          <div className="popup-overlay" onClick={loading ? null : () => toggle()}></div>
          <div className="popup-confirmation">
            <h6 className="fw-bold">{title}</h6>
            <hr style={{ marginTop: '0px' }} />
            <p>{message}</p>
            <div className="action">
              <button
                type="button"
                className={`btn ${btnType} btn-sm rounded-3`}
                onClick={() => handleConfirm()}
                disabled={loading}
              >
                {loading ? (
                  <div>
                    <Spinner size="sm" color="light" />
                    Loading..
                  </div>
                ) : (
                  'Ya'
                )}
              </button>
              {!loading && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm rounded-3"
                  onClick={() => toggle()}
                  disabled={loading}
                >
                  Tidak
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    )
  );
};

PopupConfirmation.propTypes = {
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  handleConfirm: PropTypes.func,
  toggle: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  btnType: PropTypes.string,
};

export default PopupConfirmation;
