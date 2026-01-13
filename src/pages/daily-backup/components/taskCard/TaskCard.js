import React from 'react';
import PropTypes from 'prop-types';
import './TaskCard.scss';
// hooks
import { useDaily } from '../../hooks/useDaily';

// Components
import Progress from '../progress/Progress';
import Timeline from '../timeline/Timeline';
import Members from '../members/Members';
import Button from '../button/Button';
import Check from '../check/Check';
import CheckMenu from '../checkMenu/CheckMenu';
import NewTask from './NewTask';
import TaskItem from './TaskItem';
import PopupConfirmation from '../../../../components/popup/PopupConfirmation';

const TaskCard = ({ task, title, category, refetch }) => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  const {
    handleCheckItem,
    handleCheckForAll,
    isAllChecked,
    selectedTasks,
    resetSelection,
    togglePopup,
    visiblePopup,
    handleDelete,
    deleting,
    handleBulkUpdateStatus,
    handleBulkUpdateProgress,
    isLoading,
    isNewTaskOpen,
    setIsNewTaskOpen,
  } = useDaily(task, refetch);

  return (
    <>
      <div className="task-card-container">
        <table className="task-card">
          <tbody>
            {!isNewTaskOpen ? (
              <>
                <tr className="task-parent">
                  <td colSpan="3" className="task-title">
                    {task?.task_title || title}
                  </td>
                  <td>
                    <Progress color="blue" progress={task?.task_progress} />
                  </td>
                  <td>
                    <Timeline dateRange={task?.date_range} isLate={task?.is_late} />
                  </td>
                  <td colSpan="2">
                    <Members data={task?.members} />
                  </td>
                  <td className="d-flex justify-content-end align-items-center">
                    {task?.members?.some(
                      (member) => member.employe_id === auth?.user?.employe_id,
                    ) && (
                      <div
                        className={`d-flex gap-2 justify-content-end ${
                          isAllChecked ? 'd-none' : ''
                        }`}
                      >
                        <Button
                          actionFn={() => setIsNewTaskOpen(true)}
                          color="green"
                          icon="add"
                          size="sm"
                        />
                      </div>
                    )}
                    {category === 'tambahan' && (
                      <Button
                        actionFn={() => setIsNewTaskOpen(true)}
                        color="green"
                        icon="add"
                        size="sm"
                      />
                    )}
                  </td>
                </tr>
                <tr
                  className={`task-column ${
                    isAllChecked || selectedTasks?.length ? 'bg-white' : ''
                  }`}
                >
                  <td width="30">
                    <Check checked={selectedTasks?.length > 0} action={handleCheckForAll} />
                  </td>
                  {selectedTasks?.length > 0 ? (
                    <td colSpan="8">
                      <CheckMenu
                        count={selectedTasks.length}
                        progressFn={() => togglePopup('update')}
                        reviewFn={() => togglePopup('review')}
                        deleteFn={() => togglePopup('delete')}
                        cancelFn={resetSelection}
                      />
                    </td>
                  ) : (
                    <>
                      <td colSpan="2">Nama Task</td>
                      {/* <td>PIC</td> */}
                      <td>Tipe</td>
                      <td>Progress</td>
                      <td>Jadwal</td>
                      <td>Status</td>
                      <td></td>
                    </>
                  )}
                </tr>
              </>
            ) : (
              <>
                <tr>
                  <NewTask
                    taskId={task?.task_id}
                    {...{ setIsNewTaskOpen, isNewTaskOpen, category, refetch }}
                  />
                </tr>
              </>
            )}

            {task?.daily?.length ? (
              task?.daily?.map((item) => (
                <TaskItem
                  key={item.id}
                  daily={item}
                  isChecked={selectedTasks?.some(({ id }) => id === item.id)}
                  onCheck={() => handleCheckItem(item)}
                  refetch={refetch}
                />
              ))
            ) : (
              <tr>
                <td className="text-center"></td>
                <td className="text-center"></td>
                <td className="text-center"></td>
                <td className="text-center"></td>
                <td className="text-center"></td>
                <td className="text-center"></td>
                <td className="text-center" style={{ userSelect: 'none', color: 'transparent' }}>
                  Tidak Ada Task
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PopupConfirmation
        isOpen={visiblePopup.delete}
        loading={deleting}
        toggle={() => togglePopup('delete')}
        handleConfirm={handleDelete}
        btnType="btn-danger"
        title="Konfirmasi"
        message={`Apakah Kamu yakin akan menghapus ${selectedTasks?.length} task ini?`}
      />
      <PopupConfirmation
        isOpen={visiblePopup.update}
        loading={isLoading}
        toggle={() => togglePopup('update')}
        handleConfirm={handleBulkUpdateProgress}
        btnType="btn-success"
        title="Konfirmasi"
        message={`${selectedTasks?.length} task akan diubah menjadi 100%?`}
      />
      <PopupConfirmation
        isOpen={visiblePopup.review}
        loading={isLoading}
        toggle={() => togglePopup('review')}
        handleConfirm={handleBulkUpdateStatus}
        btnType="btn-success"
        title="Konfirmasi"
        message={`${selectedTasks?.length} task akan direview?`}
      />
    </>
  );
};

TaskCard.propTypes = {
  task: PropTypes.object,
  title: PropTypes.string,
  category: PropTypes.string,
  refetch: PropTypes.func,
};

export default TaskCard;
