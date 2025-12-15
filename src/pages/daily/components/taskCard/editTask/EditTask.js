/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap'; // Label tidak lagi diperlukan, hanya Spinner
import Button from '../../button/Button';
import { useUpdateDailyTask } from '../../../hooks/useUpdateDailyTask';
// Impor file SCSS yang sama (asumsi NewTask.scss sudah diimpor di file ini atau global)
import './EditTask.scss'; // Asumsi: Kita mengimpor CSS yang sama (NewTask.scss)

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

  // Menyiapkan nilai default untuk input datetime-local
  const startDateValue = `${task.start_date.date.split('-').reverse().join('-')}T${
    task.start_date.time
  }`;
  const endDateValue = `${task.end_date.date.split('-').reverse().join('-')}T${task.end_date.time}`;

  return (
    <>
      {isLoading ? (
        // Menggunakan div biasa untuk styling loading agar tidak terikat dengan <td>
        <div className="p-3">
          <div className="d-flex justify-content-center align-items-center gap-2">
            <Spinner color="primary" size="sm" />
            <span>Update task..</span>
          </div>
        </div>
      ) : (
        // Struktur DOM disamakan dengan NewTask
        <div className="new-task-container">
          <div className="new-task">
            <div className="task-form">
              <span>Edit Task</span> {/* Judul seperti 'Task Baru' atau 'Tersalin' */}
              <div className="task-form-input">
                <div className="d-flex flex-column flex-grow-1" style={{ width: '100%' }}>
                  <span>Nama Aktivitas</span> {/* Mengganti Label dengan span */}
                  <textarea
                    name="activity_name"
                    rows="1"
                    defaultValue={task.activity_name} // Menggunakan defaultValue agar task dapat diubah tanpa state lokal
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="d-flex flex-column flex-grow-1">
                  <span>Tanggal Mulai</span> {/* Mengganti Label dengan span */}
                  <input
                    name="start_date"
                    type="datetime-local"
                    defaultValue={startDateValue} // Gunakan variabel yang sudah diolah
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="d-flex flex-column flex-grow-1">
                  <span>Tanggal Berakhir</span> {/* Mengganti Label dengan span */}
                  <input
                    name="end_date"
                    type="datetime-local"
                    defaultValue={endDateValue} // Gunakan variabel yang sudah diolah
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tambahkan kontainer untuk tombol Aksi (Batal/Update) */}
          <div className="new-task-option-container">
            {/* Kosongkan new-task-option karena tidak ada fitur Salin di EditTask */}
            <div className="new-task-option" />

            <div className="new-task-action">
              <Button type="button" text="Batal" actionFn={toggleEditTask} color="grey" size="sm" />
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
        </div>
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
