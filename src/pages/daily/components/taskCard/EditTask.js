/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import Button from '../button/Button';
import { useUpdateDailyTask } from '../../hooks/useUpdateDailyTask';

const EditTask = ({ task, setIsEditTaskOpen, isEditTaskOpen, refetch }) => {
  const toggleEditTask = () => {
    setIsEditTaskOpen(!isEditTaskOpen);
  };

  const { isLoading, handleChange, handleUpdate } = useUpdateDailyTask({
    task,
    toggleEditTask,
    refetch,
    setIsEditTaskOpen,
  });

  return (
    <>
      {isLoading ? (
        <td colSpan="6">
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Spinner color="primary" size="sm" />
            <span>Update task..</span>
          </div>
        </td>
      ) : (
        <>
          <td colSpan="6">
            <div className="d-flex gap-3">
              <div className="new-task">
                <div className="task-form">
                  <span>Edit Task </span>
                  <div className="task-form-input">
                    <textarea
                      name="activity_name"
                      rows="1"
                      defaultValue={task.activity_name}
                      onChange={(e) => handleChange(e)}
                    />
                    <input
                      name="start_date"
                      type="datetime-local"
                      defaultValue={`${task.start_date.date}T${task.start_date.time}`}
                      onChange={(e) => handleChange(e)}
                    />
                    <input
                      name="end_date"
                      type="datetime-local"
                      defaultValue={`${task.end_date.date}T${task.end_date.time}`}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 me-5 align-items-end pb-3">
                <Button
                  type="button"
                  text="Batal"
                  actionFn={toggleEditTask}
                  color="grey"
                  size="sm"
                />
                <Button
                  type="button"
                  text={isLoading ? 'Loading...' : 'Update'}
                  color="green"
                  size="sm"
                  disabled={isLoading}
                  actionFn={() => handleUpdate()}
                />
              </div>
            </div>
          </td>
        </>
      )}
    </>
  );
};

EditTask.propTypes = {
  task: PropTypes.object,
  setIsEditTaskOpen: PropTypes.func,
  isEditTaskOpen: PropTypes.bool,
  refetch: PropTypes.func,
};

export default EditTask;
