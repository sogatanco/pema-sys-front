import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import EditTask from '../editTask/EditTask';
import Check from '../../check/Check';
import Type from '../../type/Type';
import Progress from '../../progress/Progress';
import Timeline from '../../timeline/Timeline';
import MoreMenu from '../../moreMenu/MoreMenu';
import NotesButton from '../../notesButton/NotesButton';
import AttachmentButton from '../../attachmentButton/AttachmentButton';
import Button from '../../button/Button';
import { alert } from '../../../../../components/atoms/Toast';
import useAxios from '../../../../../hooks/useAxios';
import './TaskItem.scss';

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

const TaskItem = ({ daily, isChecked, onCheck, refetch, activeTab }) => {
  const api = useAxios();
  const isMobile = useIsMobile();

  const fileInputRef = useRef(null);
  const auth = JSON.parse(localStorage.getItem('auth'));
  const roles = auth?.user?.roles || [];
  const isManager = roles.some((role) => role === 'Manager');
  const isSupervisor = roles.some((role) => role === 'Supervisor');
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);

  // Toggle state
  const toggleMobileActions = () => {
    setIsMobileActionsOpen(!isMobileActionsOpen);
  };

  const toggleEditTask = () => {
    setIsEditTaskOpen(!isEditTaskOpen);
  };

  const handleChangeStatus = async (status) => {
    const dailies = [
      {
        id: daily?.id,
        progress: daily?.progress,
        status,
      },
    ];

    setIsLoading(true);

    await api
      .post(`api/module/daily/change-status`, { dailies })
      .then(() => {
        refetch();
        setIsLoading(false);
        alert('success', `Status task berhasil diubah!`);
      })
      .catch((e) => {
        setIsLoading(false);
        alert('error', e.response.data.message);
      });
  };

  // Upload File
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const handleUploadFile = async (e) => {
    const files = e?.target?.files;
    if (!files || files?.length === 0) return;

    const formData = new FormData();
    // loop semua file
    for (let i = 0; i < files?.length; i++) {
      formData.append('files[]', files[i]); // pakai array name "files[]"
    }

    setUploading(true);
    await api
      .post(`/api/daily/attachment/upload?daily_id=${daily?.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      })
      .then(() => {
        setProgress(0);
        refetch();
        alert('success', 'File berhasil diupload!');
      })
      .catch((err) => {
        console.error(err);
        alert('error', err.response?.data?.message || 'Gagal upload file');
      })
      .finally(() => {
        setUploading(false);
        e.target.value = ''; // reset input biar bisa upload file sama lagi
      });
  };
  // End Upload File

  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);
  const handleDeleteFile = async (attachment) => {
    if (!attachment || !attachment.id) return;

    setLoadingDeleteId(attachment?.id);
    setIsLoadingDelete(true);
    await api
      .delete(`api/daily/attachment/delete`, { data: { id: attachment?.id } })
      .then(() => {
        alert('success', `File berhasil dihapus!`);
      })
      .catch((e) => {
        alert('error', e.response.data.message);
      })
      .finally(() => {
        refetch();
        setIsLoadingDelete(false);
        setLoadingDeleteId(null);
      });
  };

  const actionMenus = [
    {
      id: 1,
      name: 'Review',
      action: () => {
        handleChangeStatus('review');
      },
    },
    {
      id: 2,
      name: 'Cancel',
      action: () => {
        handleChangeStatus('cancelled');
      },
    },
  ];

  return (
    <>
      {!isMobile && (
        <tr className="desktop-view">
          {/* ========================================================= */}
          {/* TD Tampilan Desktop (Visible by default) */}
          {/* ========================================================= */}
          {isEditTaskOpen ? (
            <td colSpan="8">
              <EditTask
                task={daily}
                setIsEditTaskOpen={setIsEditTaskOpen}
                isEditTaskOpen={isEditTaskOpen}
                refetch={refetch}
              />
            </td>
          ) : (
            <>
              {activeTab === 'dailies' && (
                <td>
                  <div style={{ width: '0px' }}>
                    <Check
                      checked={isChecked}
                      action={onCheck}
                      disabled={auth?.user?.employe_id !== daily?.employe_id}
                    />
                  </div>
                </td>
              )}
              <td>{daily?.activity_name}</td>
              {(activeTab === 'review' || activeTab === 'approved') && (
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
              )}
              <td>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                </div>
              </td>

              <td>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
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
              </td>

              <td>
                <Timeline dateRange={daily?.date_range} />
              </td>

              <td>
                <MoreMenu
                  menus={actionMenus}
                  taskStatus={daily?.status}
                  isLoading={isLoading}
                  refetch={refetch}
                  isChange={daily?.status === 'in progress' || daily?.status === 'revised'}
                />
              </td>
              <td colSpan="2">
                <div style={{ display: 'flex', gap: '5px', justifyContent: 'end' }}>
                  <NotesButton notes={daily?.logs} />
                  {uploading ? (
                    <div
                      className="position-relative d-inline-flex align-items-center justify-content-center"
                      style={{ width: '28px', height: '28px' }}
                    >
                      {/* Spinner melingkar */}
                      <div
                        className="spinner-border text-primary position-absolute"
                        role="status"
                        style={{ width: '28px', height: '28px', borderWidth: '3px' }}
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>

                      {/* Teks persentase di tengah */}
                      <strong
                        className="position-absolute text-primary"
                        style={{ fontSize: '8px' }}
                      >
                        {progress}%
                      </strong>
                    </div>
                  ) : (
                    <>
                      <AttachmentButton
                        daily={daily}
                        fileInputRef={fileInputRef}
                        handleUploadFile={handleUploadFile}
                        handleDeleteFile={handleDeleteFile}
                        isLoadingDelete={isLoadingDelete}
                        loadingDeleteId={loadingDeleteId}
                        isChange={
                          (daily?.status === 'in progress' || daily?.status === 'revised') &&
                          auth?.user?.employe_id === daily?.employe_id
                        }
                      />
                    </>
                  )}

                  {daily?.employe_id === auth?.user?.employe_id && (
                    <>
                      <Button
                        actionFn={
                          daily?.status === 'approved' || daily?.status.includes('review')
                            ? undefined
                            : toggleEditTask
                        }
                        color="grey"
                        icon="edit_document"
                        text=""
                        size="sm"
                        disabled={daily?.status === 'approved'}
                      />
                    </>
                  )}
                </div>
              </td>
            </>
          )}
        </tr>
      )}

      {isMobile && (
        <tr className="mobile-view">
          {isEditTaskOpen ? (
            <td colSpan="2">
              <EditTask
                task={daily}
                setIsEditTaskOpen={setIsEditTaskOpen}
                isEditTaskOpen={isEditTaskOpen}
                refetch={refetch}
              />
            </td>
          ) : (
            <td colSpan="2">
              <div className="task-item-wrapper">
                <div className="task-item-header">
                  <div className="task-item-title-group">
                    {activeTab === 'dailies' && (
                      <div className="task-item-check">
                        <Check checked={isChecked} action={onCheck} />
                      </div>
                    )}
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

                <div className="task-item-timeline-mobile">
                  <Timeline dateRange={daily?.date_range} />
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
                    <NotesButton notes={daily?.logs} />

                    {uploading ? (
                      <div
                        className="position-relative d-inline-flex align-items-center justify-content-center"
                        style={{ width: '28px', height: '28px' }}
                      >
                        {/* Spinner melingkar */}
                        <div
                          className="spinner-border text-primary position-absolute"
                          role="status"
                          style={{ width: '28px', height: '28px', borderWidth: '3px' }}
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>

                        {/* Teks persentase di tengah */}
                        <strong
                          className="position-absolute text-primary"
                          style={{ fontSize: '8px' }}
                        >
                          {progress}%
                        </strong>
                      </div>
                    ) : (
                      <>
                        <AttachmentButton
                          daily={daily}
                          fileInputRef={fileInputRef}
                          handleUploadFile={handleUploadFile}
                          handleDeleteFile={handleDeleteFile}
                          isLoadingDelete={isLoadingDelete}
                          loadingDeleteId={loadingDeleteId}
                          isChange={
                            (daily?.status === 'in progress' || daily?.status === 'revised') &&
                            auth?.user?.employe_id === daily?.employe_id
                          }
                        />
                      </>
                    )}

                    {daily?.employe_id === auth?.user?.employe_id && (
                      <>
                        <Button
                          actionFn={
                            daily?.status === 'approved' || daily?.status.includes('review')
                              ? undefined
                              : toggleEditTask
                          }
                          color="grey"
                          icon="edit_document"
                          text=""
                          size="sm"
                          disabled={daily?.status === 'approved'}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </td>
          )}
        </tr>
      )}
    </>
  );
};

TaskItem.propTypes = {
  daily: PropTypes.object,
  isChecked: PropTypes.bool,
  onCheck: PropTypes.func,
  refetch: PropTypes.func,
  activeTab: PropTypes.string,
};

export default TaskItem;
