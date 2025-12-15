/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import Button from '../button/Button';
import { useNewDailyTask } from '../../hooks/useNewDailyTask';

const NewTask = ({ taskId, setIsNewTaskOpen, isNewTaskOpen, category, refetch }) => {
  const toggleNewTask = () => {
    setIsNewTaskOpen(!isNewTaskOpen);
  };

  const {
    isLoading,
    taskForms,
    countCopy,
    handleChange,
    handleCopyChange,
    deleteCopy,
    handleSubmit,
  } = useNewDailyTask({ taskId, category, toggleNewTask, refetch, setIsNewTaskOpen });

  return (
    <>
      {isLoading ? (
        <td colSpan="6">
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Spinner color="primary" size="sm" />
            <span>Menyimpan task baru..</span>
          </div>
        </td>
      ) : (
        <>
          <td colSpan="6">
            <div className="new-task">
              {taskForms.map((form, index) => (
                <div className="task-form" key={index}>
                  <span>{index === 0 ? 'Task Baru' : `Tersalin ${index}`}</span>
                  <div className="task-form-input">
                    <div className="d-flex flex-column flex-grow-1" style={{ width: '100%' }}>
                      <span>Activity Name</span>
                      <textarea
                        rows="1"
                        value={form.activityName}
                        onChange={(e) => handleChange(index, 'activityName', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="d-flex flex-column flex-grow-1">
                      <span>Tanggal Mulai</span>
                      <input
                        type="datetime-local"
                        value={form.startDate}
                        onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div className="d-flex flex-column flex-grow-1">
                      <span>Tanggal Berakhir</span>
                      <input
                        type="datetime-local"
                        value={form.endDate}
                        onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  {index !== 0 && (
                    <div className="task-form-action">
                      <Button
                        type="button"
                        icon="close"
                        color="red"
                        size="sm"
                        actionFn={() => deleteCopy(index)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </td>
          <td colSpan="2" className="new-task-option-container">
            <div className="new-task-option">
              <div className="option-group">
                <span htmlFor="copy">Salin</span>
                <input
                  type="number"
                  id="copy"
                  value={countCopy}
                  min="0"
                  max="10"
                  onChange={(e) => handleCopyChange(e.target.value)}
                />
              </div>
            </div>
            <div className="new-task-action">
              <Button type="button" text="Batal" actionFn={toggleNewTask} color="grey" size="sm" />
              <Button
                type="button"
                text={isLoading ? 'Loading...' : 'Simpan'}
                color="green"
                size="sm"
                disabled={isLoading}
                actionFn={() => handleSubmit()}
              />
            </div>
          </td>
        </>
      )}
    </>
  );
};

NewTask.propTypes = {
  taskId: PropTypes.number,
  setIsNewTaskOpen: PropTypes.func,
  isNewTaskOpen: PropTypes.bool,
  category: PropTypes.string,
  refetch: PropTypes.func,
};

export default NewTask;
