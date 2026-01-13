import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Type from '../../type/Type';
import Progress from '../../progress/Progress';
import Timeline from '../../timeline/Timeline';
import MoreMenu from '../../moreMenu/MoreMenu';
import NotesButton from '../../notesButton/NotesButton';
import AttachmentButton from '../../attachmentButton/AttachmentButton';
import Button from '../../button/Button';
import { alert } from '../../../../../components/atoms/Toast';
import PopupConfirmation from '../../../../../components/popup/PopupConfirmation';
import Popup from '../../../../../components/popup/Popup';
import useAxios from '../../../../../hooks/useAxios';
import './TaskItemReview.scss';

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

const TaskItemReview = ({ daily, refetch }) => {
  const api = useAxios();
  const auth = JSON.parse(localStorage.getItem('auth'));
  const roles = auth?.user?.roles || [];
  const isManager = roles.some((role) => role === 'Manager');
  const isSupervisor = roles.some((role) => role === 'Supervisor');

  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [isApproveTaskOpen, setIsApproveTaskOpen] = useState(false);
  const [isReviseTaskOpen, setIsReviseTaskOpen] = useState(false);
  const [revisiReason, setRevisiReason] = useState('');
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);

  // Toggle state
  const toggleMobileActions = () => {
    setIsMobileActionsOpen(!isMobileActionsOpen);
  };

  const actionMenus = [
    { id: 1, name: 'Review (Disabled)', action: () => {} },
    { id: 2, name: 'Cancel (Disabled)', action: () => {} },
  ];

  const toggleApproveTask = () => {
    setIsApproveTaskOpen(!isApproveTaskOpen);
  };
  const handleApproveTask = () => {
    let status = '';
    if (isManager) {
      status = 'approved';
    }
    if (isSupervisor) {
      status = 'review manager';
    }

    setIsLoading(true);
    api
      .put(`api/daily/change-status`, { id: daily?.id, status })
      .then(() => {
        refetch();
        alert('success', 'Task berhasil diapprove!');
      })
      .catch((e) => {
        alert('error', e.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsApproveTaskOpen(false);
      });
  };

  const toggleReviseTask = () => {
    setIsReviseTaskOpen(!isReviseTaskOpen);
    setRevisiReason('');
  };

  const handleReviseTask = () => {
    if (revisiReason.trim() === '') {
      alert('error', 'Alasan revisi harus diisi!');
      return;
    }
    setIsLoading(true);
    api
      .put(`api/daily/change-status`, {
        id: daily?.id,
        status: 'revised',
        notes: revisiReason,
      })
      .then(() => {
        refetch();
        alert('success', 'Status task berhasil diubah!');
      })
      .catch((e) => {
        alert('error', e.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsReviseTaskOpen(false);
        setRevisiReason('');
      });
  };

  return (
    <>
      {!isMobile && (
        <tr className="desktop-view">
          <td colSpan="2">{daily?.activity_name}</td>
          <td>
            <div
              className="created_by"
              style={{
                display: 'inline-block',
                background: '#eef5ff',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '8px',
                fontWeight: '600',
                color: '#1766d1',
                border: '1px solid #cfe1ff',
                whiteSpace: 'nowrap',
              }}
            >
              {daily?.created_by}
            </div>
          </td>
          <td>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Type
                taskId={daily?.id}
                type={daily?.is_priority.toString()}
                isChange
                refetch={refetch}
              />
            </div>
          </td>
          <td>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Progress color="blue" taskId={daily?.id} progress={daily?.progress} />
            </div>
          </td>
          <td>
            <Timeline dateRange={daily?.date_range} />
          </td>
          <td>
            <MoreMenu menus={actionMenus} taskStatus={daily?.status} />
          </td>
          <td colSpan="2">
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'end' }}>
              <NotesButton notes={daily?.logs} />

              <AttachmentButton daily={daily} />

              <Button
                type="button"
                color="green"
                size="sm"
                actionFn={() => toggleApproveTask(daily?.id)}
                icon="check_circle"
              />
              <Button
                type="button"
                color="red"
                size="sm"
                actionFn={() => toggleReviseTask(daily?.id)}
                icon="cancel"
              />
            </div>
          </td>
        </tr>
      )}

      {isMobile && (
        <tr className="mobile-view">
          <td colSpan="2">
            <div className="task-item-wrapper">
              <div className="task-item-header">
                <div className="task-item-title-group">
                  <span className="task-item-activity-name">{daily?.activity_name}</span>
                </div>
                <div className="task-item-progress-mobile">
                  <Progress
                    color={
                      daily?.status.includes('review')
                        ? 'blue'
                        : daily?.status === 'approved'
                        ? 'green'
                        : 'yellow'
                    }
                    taskId={daily?.id}
                    progress={daily?.progress}
                    isChange={
                      (daily?.status === 'in progress' || daily?.status === 'revised') &&
                      auth?.user?.employe_id === daily?.employe_id
                    }
                    refetch={refetch}
                  />
                </div>
              </div>

              <div className="task-item-timeline-mobile mt-1">
                <div className="d-flex align-items-center justify-content-between">
                  <Timeline dateRange={daily?.date_range} />
                  <div
                    className="created_by"
                    style={{
                      display: 'inline-block',
                      background: '#eef5ff',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '8px',
                      fontWeight: '600',
                      color: '#1766d1',
                      border: '1px solid #cfe1ff',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {daily?.created_by}
                  </div>
                </div>
              </div>
              <hr />

              <div className="task-item-actions-group">
                <div className="task-item-status-group">
                  <Type
                    taskId={daily?.id}
                    type={daily?.is_priority.toString()}
                    isChange={
                      daily?.status === 'in progress' ||
                      daily?.status === 'revised' ||
                      ((isManager || isSupervisor) && daily?.status.includes('review'))
                    }
                    refetch={refetch}
                  />
                  <MoreMenu
                    menus={actionMenus}
                    taskStatus={daily?.status}
                    isLoading={isLoading}
                    refetch={refetch}
                    isChange={daily?.status === 'in progress' || daily?.status === 'revised'}
                  />
                </div>

                <Button
                  actionFn={toggleMobileActions}
                  color="grey"
                  icon="more_horiz"
                  text=""
                  size="sm"
                />
              </div>
              {isMobileActionsOpen && (
                <div className="task-item-secondary-actions">
                  {daily?.logs?.length > 0 && <NotesButton notes={daily?.logs} />}
                  <AttachmentButton daily={daily} />
                  <Button
                    type="button"
                    color="green"
                    size="sm"
                    actionFn={() => toggleApproveTask(daily?.id)}
                    icon="check_circle"
                  />
                  <Button
                    type="button"
                    color="red"
                    size="sm"
                    actionFn={() => toggleReviseTask(daily?.id)}
                    icon="cancel"
                  />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      <PopupConfirmation
        isOpen={isApproveTaskOpen}
        toggle={toggleApproveTask}
        loading={isLoading}
        title="Approve Task"
        message="Apakah kamu yakin ingin menyetujui task ini?"
        handleConfirm={handleApproveTask}
        btnType="btn-success"
      />

      <Popup
        isOpen={isReviseTaskOpen}
        togglePopup={toggleReviseTask}
        title="Revise Task"
        closeButton
      >
        <>
          <textarea
            placeholder="Tuliskan alasan revisi..."
            style={{
              width: '100%',
              minHeight: '100px',
              marginTop: '10px',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              resize: 'vertical',
            }}
            value={revisiReason}
            onChange={(e) => setRevisiReason(e.target.value)}
          />

          <div
            style={{ marginTop: '15px', textAlign: 'right' }}
            className="d-flex gap-1 justify-content-end"
          >
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => toggleReviseTask()}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleReviseTask}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </div>
        </>
      </Popup>
    </>
  );
};

TaskItemReview.propTypes = {
  daily: PropTypes.object,
  refetch: PropTypes.func,
};

export default TaskItemReview;
