import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import './CommentButton.scss';

const CommentButton = ({ comments = [] }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  // Tutup popup jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="comment-button-wrapper">
      <div ref={buttonRef}>
        <Button
          actionFn={() => setShowPopup(!showPopup)}
          color="grey"
          icon="comment"
          text=""
          size="sm"
          badge
          badgeColor="red"
          badgeCount={comments?.length || 0}
        />
      </div>

      {showPopup && (
        <div ref={popupRef} className="comment-popup">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div className="comment-item" title={comment.text}>
                <span className="comment-author">{comment.author}</span>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))
          ) : (
            <div className="no-comment">Belum ada komentar</div>
          )}
        </div>
      )}
    </div>
  );
};

CommentButton.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      author: PropTypes.string,
      text: PropTypes.string,
    }),
  ),
};

export default CommentButton;
