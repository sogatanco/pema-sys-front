import React, { useState, useRef, useEffect } from 'react';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import './AttachmentPopup.scss';
import { alert } from '../../../../components/atoms/Toast';

// Nilai batas (threshold) untuk menentukan apakah popup harus muncul di bawah
const TOP_THRESHOLD = 360;
// Margin di atas/bawah tombol (sesuai dengan 120% yang ada di CSS sebelumnya)
const MARGIN_PERCENT = '120%';

const AttachmentButton = ({
  daily,
  fileInputRef = null,
  handleUploadFile = null,
  handleDeleteFile = null,
  isLoadingDelete = false,
  loadingDeleteId = null,
  isChange,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({});
  const popupRef = useRef(null);
  const buttonWrapperRef = useRef(null);

  // LOGIKA: Hitung posisi popup (di atas atau di bawah)
  useEffect(() => {
    if (showPopup && buttonWrapperRef.current) {
      const buttonRect = buttonWrapperRef.current.getBoundingClientRect();

      // Jika jarak dari atas kurang dari TOP_THRESHOLD, munculkan popup di bawah
      if (buttonRect.top < TOP_THRESHOLD) {
        setPopupPosition({
          top: MARGIN_PERCENT, // Muncul di bawah
          bottom: 'auto',
        });
      } else {
        // Jika jarak dari atas cukup, munculkan popup di atas
        setPopupPosition({
          bottom: MARGIN_PERCENT, // Muncul di atas
          top: 'auto',
        });
      }
    }
  }, [showPopup]);

  // LOGIKA: Tutup popup kalau klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Jika ref popup ada DAN klik TIDAK ada di dalam popup (termasuk tombol)
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePopup = () => {
    if (daily?.attachments?.length > 0) {
      setShowPopup(!showPopup);
    } else if ((daily?.status === 'in progress' || daily?.status === 'revised') && isChange) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="attachment-popup-wrapper" ref={popupRef}>
      <input type="file" hidden ref={fileInputRef} onChange={handleUploadFile} multiple />

      {/* Bungkus Button di div untuk mendapatkan posisi tombol */}
      <div ref={buttonWrapperRef}>
        <Button
          actionFn={togglePopup}
          color="grey"
          icon="attach_file"
          text=""
          size="sm"
          badge
          badgeColor={daily?.attachments?.length > 0 ? 'red' : 'grey'}
          badgeCount={daily?.attachments?.length || 0}
        />
      </div>

      {/* Popup custom - Suntikkan style posisi secara inline */}
      {showPopup && (
        <div className="attachment-popup" style={popupPosition}>
          {daily?.attachments?.length > 0 ? (
            // Wrapper untuk scrolling
            <div className="attachment-list">
              {daily.attachments.map((att) => (
                <div key={att.id || att.file_path} className="attachment-item">
                  <span className="attachment-name" title={att.original_name}>
                    {att.original_name}
                  </span>
                  <div className="attachment-actions">
                    <div className="d-flex align-items-center justify-content-end gap-1">
                      <a href={att.file_path} target="_blank" rel="noreferrer" title="Lihat file">
                        <MaterialIcon icon="link" style={{ fontSize: '22px' }} />
                      </a>
                      {(daily?.status === 'in progress' || daily?.status === 'revised') && (
                        <button
                          type="button"
                          className="delete-btn"
                          title="Hapus file"
                          onClick={() => handleDeleteFile(att)}
                          disabled={loadingDeleteId === att?.id && isLoadingDelete}
                        >
                          {isLoadingDelete && loadingDeleteId === att.id ? (
                            '⌛'
                          ) : (
                            <MaterialIcon icon="delete" style={{ fontSize: '22px' }} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-file">Belum ada file</div>
          )}

          {daily?.status !== 'cancelled' && (
            <div className="choose-file-btn">
              {daily?.status.includes('review') ? (
                ''
              ) : (
                <>
                  {isChange && (
                    <Button
                      actionFn={() => {
                        if (daily?.status === 'in progress' || daily?.status === 'revised') {
                          fileInputRef.current.click();
                        } else {
                          alert(
                            'info',
                            'Task sudah selesai atau menunggu review, tidak bisa menambah lampiran.',
                          );
                        }
                      }}
                      color="primary"
                      text="Pilih File"
                      size="sm"
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

AttachmentButton.propTypes = {
  daily: PropTypes.shape({
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        original_name: PropTypes.string,
        file_path: PropTypes.string,
      }),
    ),
    status: PropTypes.string,
  }),
  fileInputRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  handleUploadFile: PropTypes.func,
  handleDeleteFile: PropTypes.func,
  isLoadingDelete: PropTypes.bool,
  loadingDeleteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isChange: PropTypes.bool,
};

export default AttachmentButton;
