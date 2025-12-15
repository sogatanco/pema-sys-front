import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDaily } from '../../hooks/useDaily';
import Check from '../check/Check';
import CheckMenu from '../checkMenu/CheckMenu';
import Progress from '../progress/Progress';
import Timeline from '../timeline/Timeline';
import Members from '../members/Members';
import Button from '../button/Button';
import NewTask from './newTask/NewTask';
import TaskItem from './taskItem/TaskItem';
import PopupConfirmation from '../../../../components/popup/PopupConfirmation';

import './TaskCard.scss';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const TaskCard = ({ task, title, category, refetch, selectedStaff, activeTab }) => {
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

  const isMobile = useIsMobile(768);

  const colSpanValue = isMobile ? 1 : 3;

  return (
    <>
      <div className="task-card-container">
        <table className="task-card">
          <tbody>
            <tr className="task-parent">
              <td className="task-card-title" colSpan={colSpanValue}>
                {task?.task_title || title}
              </td>
              <td className="progress-desktop">
                <div className="d-flex align-items-center justify-content-center">
                  <Progress color="blue" progress={task?.task_progress} />
                </div>
              </td>
              <td>
                <Timeline dateRange={task?.date_range} isLate={task?.is_late} />
              </td>
              <td colSpan="2">
                <Members data={task?.members} />
              </td>
              <td>
                <div className="button-add">
                  <div className="d-md-none">
                    <Members data={task?.members} />
                  </div>
                  {!isNewTaskOpen && activeTab === 'dailies' && (
                    <>
                      {selectedStaff?.employe_id === auth?.user?.employe_id && (
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
                    </>
                  )}
                </div>
              </td>
            </tr>

            {/* Mobile */}
            <tr className="mobile-display">
              <td>
                <Timeline dateRange={task?.date_range} />
              </td>
              <td>
                <div className="d-flex align-items-center justify-content-end">
                  <Progress color="blue" progress={task?.task_progress} />
                </div>
              </td>
            </tr>

            {/* <tr className="mobile-display">
              <td colSpan="2">
                <NewTask taskId={0} {...{ setIsNewTaskOpen, isNewTaskOpen, category, refetch }} />
              </td>
            </tr> */}

            {!isNewTaskOpen ? (
              <>
                {/* <tr className="task-column d-none d-md-table-row"> */}
                <tr
                  className={`task-column d-none d-md-table-row ${
                    isAllChecked || selectedTasks?.length ? 'bg-white' : ''
                  }`}
                >
                  {activeTab === 'dailies' && (
                    <td width="30">
                      <Check checked={selectedTasks?.length > 0} action={handleCheckForAll} />
                    </td>
                  )}

                  {selectedTasks?.length > 0 ? (
                    <>
                      <td colSpan="7">
                        <CheckMenu
                          count={selectedTasks?.length}
                          progressFn={() => togglePopup('update')}
                          reviewFn={() => togglePopup('review')}
                          deleteFn={() => togglePopup('delete')}
                          cancelFn={resetSelection}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td>Nama Task</td>
                      {(activeTab === 'review' || activeTab === 'approved') && <td>PIC</td>}
                      <td style={{ textAlign: 'center' }}>Tipe</td>
                      <td style={{ textAlign: 'center' }}>Progress</td>
                      <td>Jadwal</td>
                      <td>Status</td>
                      <td colSpan="2"></td>
                    </>
                  )}
                  {/* <td>Aksi</td> */}
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="8">
                  <NewTask
                    taskId={task?.task_id}
                    {...{ setIsNewTaskOpen, isNewTaskOpen, category, refetch }}
                  />
                </td>
              </tr>
            )}

            {task?.daily?.length ? (
              task?.daily?.map((item) => (
                <TaskItem
                  key={item.id}
                  daily={item}
                  isChecked={selectedTasks?.some(({ id }) => id === item.id)}
                  onCheck={() => handleCheckItem(item)}
                  refetch={refetch}
                  activeTab={activeTab}
                />
              ))
            ) : (
              <>
                {!isNewTaskOpen && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Tidak Ada Task
                    </td>
                  </tr>
                )}
              </>
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
  selectedStaff: PropTypes.object,
  activeTab: PropTypes.string,
};

export default TaskCard;
