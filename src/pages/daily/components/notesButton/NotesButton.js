import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import './NotesButton.scss';

// Nilai batas (threshold) untuk menentukan apakah popup harus muncul di bawah
const TOP_THRESHOLD = 465;
// Margin di atas atau di bawah tombol saat popup muncul
const MARGIN = 10;

const NotesButton = ({ notes = [] }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState([]);
  const [popupPosition, setPopupPosition] = useState({});
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const togglePopup = () => setShowPopup((prev) => !prev);

  // LOGIKA BARU: Hitung posisi popup
  useEffect(() => {
    if (showPopup && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();

      // Jika jarak dari atas (buttonRect.top) kurang dari TOP_THRESHOLD
      // munculkan popup di bawah tombol dengan mengatur 'top'.
      if (buttonRect.top < TOP_THRESHOLD) {
        // Munculkan popup di bawah
        setPopupPosition({
          top: `calc(100% + ${MARGIN}px)`,
          bottom: 'auto',
        });
      } else {
        setPopupPosition({
          // Munculkan popup di atas
          bottom: `calc(100% + ${MARGIN}px)`,
          top: 'auto',
        });
      }
    }
  }, [showPopup]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  // Toggle "Selengkapnya"
  const toggleExpand = (id) => {
    setExpandedNotes((prev) => (prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]));
  };

  return (
    <div className="notes-button-wrapper">
      <div ref={buttonRef}>
        <Button
          actionFn={togglePopup}
          color="grey"
          icon="sticky_note_2"
          text=""
          size="sm"
          badge={notes?.length > 0}
          badgeColor="red"
          badgeCount={notes?.length || 0}
        />
      </div>

      {showPopup && (
        <div ref={popupRef} className="notes-popup" style={popupPosition}>
          <div className="notes-popup-header">
            <span>Catatan ({notes?.length || 0})</span>
            <button type="button" className="close-btn" onClick={togglePopup}>
              ✕
            </button>
          </div>

          {notes?.length > 0 ? (
            <div className="notes-list">
              {notes?.map((note) => {
                const isExpanded = expandedNotes?.includes(note.id);
                const isLong = note?.notes?.length > 100;

                return (
                  <div key={note.id} className="note-item">
                    <div className="note-date">
                      <div className="note-date-time">{note?.created_at}</div>
                      <div className="note-activity">{note?.activity_name}</div>
                    </div>

                    <div className="note-body">
                      {note?.notes ? (
                        <>
                          <span
                            className={`note-text ${isExpanded ? 'expanded' : ''}`}
                            title={note?.notes}
                          >
                            {isExpanded ? note?.notes : note?.notes.slice(0, 100)}
                            {isLong && !isExpanded && '...'}
                          </span>

                          {isLong && (
                            <button
                              type="button"
                              className="see-more-btn"
                              onClick={() => toggleExpand(note?.id)}
                            >
                              {isExpanded ? 'Sembunyikan' : 'Selengkapnya'}
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="note-empty">Tidak ada catatan.</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-note">Belum ada catatan</div>
          )}
        </div>
      )}
    </div>
  );
};

NotesButton.propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      notes: PropTypes.string,
      created_at: PropTypes.string,
      activity_name: PropTypes.string,
    }),
  ),
};

export default NotesButton;
