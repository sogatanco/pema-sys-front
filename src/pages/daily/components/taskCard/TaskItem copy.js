import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Progress from '../progress/Progress';
import Check from '../check/Check';
import Timeline from '../timeline/Timeline';
import MoreMenu from '../moreMenu/MoreMenu';
import useAxios from '../../../../hooks/useAxios';
import { alert } from '../../../../components/atoms/Toast';
import EditTask from './EditTask';
import AttachmentButton from '../attachmentButton/AttachmentButton';
// import CommentButton from '../commentButton/CommentButton';
import NotesButton from '../notesButton/NotesButton';
import Type from '../type/Type';
import Popup from '../../../../components/popup/Popup';
import PopupConfirmation from '../../../../components/popup/PopupConfirmation';

const TaskItem = ({ daily, isChecked, onCheck, refetch }) => {
  const api = useAxios();
  const auth = JSON.parse(localStorage.getItem('auth'));
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);

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

  const toggleEditTask = () => {
    setIsEditTaskOpen(!isEditTaskOpen);
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

  const [isApproveTaskOpen, setIsApproveTaskOpen] = useState(false);
  const [isReviseTaskOpen, setIsReviseTaskOpen] = useState(false);
  const [revisiReason, setRevisiReason] = useState('');

  const roles = auth?.user?.roles || [];
  const isManager = roles.some((role) => role === 'Manager');
  const isSupervisor = roles.some((role) => role === 'Supervisor');

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
      <tr className="task-item">
        {isEditTaskOpen ? (
          <EditTask
            task={daily}
            setIsEditTaskOpen={setIsEditTaskOpen}
            isEditTaskOpen={isEditTaskOpen}
            refetch={refetch}
          />
        ) : (
          <>
            <td width="30">
              <Check
                checked={isChecked}
                action={onCheck}
                disabled={auth?.user?.employe_id !== daily?.employe_id}
              />
            </td>
            <td width="300">{daily?.activity_name}</td>
            <td width="100">
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
            <td width="150">
              <Type
                taskId={daily?.id}
                type={daily?.is_priority.toString()}
                isChange={daily?.status === 'in progress' || daily?.status === 'revised'}
                refetch={refetch}
              />
            </td>
            <td width="100">
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
            </td>
            <td width="400px">
              <Timeline dateRange={daily?.date_range} />
            </td>
            <td width="100">
              <>
                <MoreMenu
                  menus={actionMenus}
                  taskStatus={daily?.status}
                  isLoading={isLoading}
                  refetch={refetch}
                  isChange={
                    (daily?.status === 'in progress' || daily?.status === 'revised') &&
                    auth?.user?.employe_id === daily?.employe_id
                  }
                />
              </>
            </td>
            <td width="100">
              <div className="d-flex justify-content-end gap-2 align-items-center">
                {daily?.logs?.length > 0 && <NotesButton notes={daily?.logs} />}

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
                    <strong className="position-absolute text-primary" style={{ fontSize: '8px' }}>
                      {progress}%
                    </strong>
                  </div>
                ) : (
                  <>
                    {/* <input
                      type="file"
                      hidden
                      ref={fileInputRef}
                      onChange={handleUploadFile}
                      multiple
                    /> */}

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

                    {/* {daily?.attachments?.length > 0 ? (
                      <Button
                        color="grey"
                        icon="attach_file"
                        text=""
                        size="sm"
                        badge
                        badgeColor="red"
                        badgeCount={daily?.attachments?.length || 0}
                      />
                    ) : (
                      <Button
                        actionFn={() => fileInputRef.current.click()}
                        color="grey"
                        icon="attach_file"
                        text=""
                        size="sm"
                        badgeColor="grey"
                      />
                    )} */}
                  </>
                )}
                {/* {daily?.status !== 'approved' && (
                  <Button
                    actionFn={() => {
                      toggleEditTask();
                    }}
                    color="grey"
                    icon="edit_document"
                    text=""
                    size="sm"
                  ></Button>
                )} */}
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

                {daily?.status.includes('review') &&
                  daily?.employe_id !== auth?.user?.employe_id && (
                    <>
                      <Button
                        actionFn={() => toggleApproveTask(daily?.id)}
                        color="green"
                        icon="check_circle"
                        text=""
                        size="sm"
                      ></Button>
                      <Button
                        actionFn={() => toggleReviseTask(daily?.id)}
                        color="red"
                        icon="cancel"
                        text=""
                        size="sm"
                      ></Button>
                    </>
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
              </div>
            </td>
          </>
        )}
      </tr>
    </>
  );
};

TaskItem.propTypes = {
  daily: PropTypes.object,
  isChecked: PropTypes.bool,
  onCheck: PropTypes.func,
  refetch: PropTypes.func,
};

export default TaskItem;
