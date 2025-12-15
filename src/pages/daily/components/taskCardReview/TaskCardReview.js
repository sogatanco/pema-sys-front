import React from 'react';
import PropTypes from 'prop-types';
import Progress from '../progress/Progress';
import Timeline from '../timeline/Timeline';
import Members from '../members/Members';
import TaskItemReview from './taskItemReview/TaskItemReview';
// import PopupConfirmation from '../../../../components/popup/PopupConfirmation';

import './TaskCardReview.scss';

const TaskCardReview = ({ task, title, refetch }) => {
  // VARIABEL DUMMY UNTUK KONDISI TAMPILAN
  const isMobile = window.innerWidth < 768;
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
                <Timeline dateRange={task?.date_range} />
              </td>
              <td colSpan="2">
                <Members data={task?.members} />
              </td>
              <td>
                <div className="button-add">
                  <div className="d-md-none">
                    <Members data={task?.members} />
                  </div>
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

            <tr className="task-column d-none d-md-table-row">
              <td colSpan="2">Nama Task</td>
              <td>PIC</td>
              <td style={{ textAlign: 'center' }}>Tipe</td>
              <td style={{ textAlign: 'center' }}>Progress</td>
              <td>Jadwal</td>
              <td>Status</td>
              <td></td>
            </tr>

            {/* Task Item */}
            {task?.daily_review?.length ? (
              task?.daily_review?.map((item) => (
                <TaskItemReview key={item.id} daily={item} refetch={refetch} />
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="8" className="text-center">
                    Tidak Ada Task
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

TaskCardReview.propTypes = {
  task: PropTypes.object,
  title: PropTypes.string,
  refetch: PropTypes.func,
};
export default TaskCardReview;
