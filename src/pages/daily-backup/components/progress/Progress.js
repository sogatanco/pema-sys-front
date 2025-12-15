import React, { useState } from 'react';
import './Progress.scss';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import Button from '../button/Button';
import useAxios from '../../../../hooks/useAxios';
import { alert } from '../../../../components/atoms/Toast';

const Progress = ({ color, taskId, progress, isChange, refetch }) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [progressUpdate, setProgressUpdate] = useState(progress);
  const [isLoading, setIsLoading] = useState(false);

  const api = useAxios();

  const progressUpdateToggle = () => {
    setIsUpdate(() => !isUpdate);
  };

  const changeProgress = (e) => {
    setProgressUpdate(parseInt(e.target.value, 10));
  };

  const overlayFn = () => {
    progressUpdateToggle();
    setProgressUpdate(progress);
  };

  const handleChangeProgress = async (isReview = false) => {
    setIsLoading(true);

    const dailies = [
      {
        id: taskId,
        progress: progressUpdate,
        change_to_review: isReview,
      },
    ];

    await api
      .put(`api/module/daily/change-progress`, { dailies })
      .then(() => {
        refetch();
        progressUpdateToggle();
        setIsLoading(false);
        alert('success', `Progress has been updated !`);
      })
      .catch(() => {
        progressUpdateToggle();
        alert('error', 'Something went wrong');
        setIsLoading(false);
      });
  };

  return (
    <div className="progress-container">
      {isUpdate && (
        <>
          <div className="progress-popup-overlay" onClick={overlayFn}></div>
          <div className="progress-popup">
            <div className="progress-popup-body">
              <div className="input">
                <input
                  type="range"
                  defaultValue={progress}
                  min="0"
                  max="100"
                  onChange={changeProgress}
                />
                <span>{progressUpdate}%</span>
              </div>
              {isLoading ? (
                <div className="d-flex gap-2">
                  <Spinner color="primary" size="sm" />
                  <span>Menyimpan...</span>
                </div>
              ) : progressUpdate === progress && progress !== 100 ? (
                <span>Swipe for update progress</span>
              ) : (
                <div className="d-flex gap-2">
                  {progressUpdate === 100 && (
                    <Button
                      color="grey"
                      size="sm"
                      text="Kirim Ke Review"
                      actionFn={() => handleChangeProgress(true)}
                    ></Button>
                  )}
                  <Button
                    color="green"
                    size="sm"
                    text="Simpan"
                    actionFn={() => handleChangeProgress()}
                  ></Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <div
        className={`progress-body ${isChange ? 'change' : ''}`}
        onClick={isChange ? progressUpdateToggle : null}
      >
        <div className={`bar ${color}`} style={{ width: `${progress}%` }}></div>
        <span>{progress}%</span>
      </div>
    </div>
  );
};

Progress.propTypes = {
  color: PropTypes.string,
  taskId: PropTypes.number,
  progress: PropTypes.number,
  isChange: PropTypes.bool,
  refetch: PropTypes.func,
};

export default Progress;
