import React, { useState } from 'react';
import './CheckMenu.scss';
import PropTypes from 'prop-types';
import Button from '../button/Button';

const CheckMenu = ({ count, progressFn, reviewFn, deleteFn, cancelFn }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="check-menu-container">
      <div className="menu-title">{count} task terpilih</div>
      <div className="menu-body">
        <div className="menu-item">
          {/* <Button
            actionFn={() => {
              setIsCopied(!isCopied);
            }}
            color="grey"
            text={isCopied ? 'Copied' : 'Copy'}
            size="sm"
          /> */}
          {!isCopied && (
            <>
              <Button
                actionFn={() => {
                  progressFn();
                }}
                color="green"
                text="Ubah Progress 100%"
                size="sm"
              />
              <Button
                actionFn={() => {
                  reviewFn();
                }}
                color="green"
                text="Kirim Review"
                size="sm"
              />
              <Button
                actionFn={() => {
                  deleteFn();
                }}
                color="red"
                text="Hapus"
                size="sm"
              />
              <Button
                actionFn={() => {
                  cancelFn();
                }}
                color="grey"
                text="Batal"
                size="sm"
              />
            </>
          )}
        </div>
        <div className="menu-item">
          {isCopied && (
            <>
              <Button
                actionFn={() => {
                  setIsCopied(false);
                }}
                color="grey"
                text="Cancel"
                size="sm"
              />
              <Button actionFn={() => {}} color="green" text="Paste Task" size="sm" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

CheckMenu.propTypes = {
  count: PropTypes.number,
  progressFn: PropTypes.func,
  deleteFn: PropTypes.func,
  reviewFn: PropTypes.func,
  cancelFn: PropTypes.func,
};

export default CheckMenu;
