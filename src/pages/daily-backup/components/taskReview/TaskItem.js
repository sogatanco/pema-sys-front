import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Progress from '../progress/Progress';
// import Check from '../check/Check';
import Timeline from '../timeline/Timeline';
import MoreMenu from '../moreMenu/MoreMenu';
import useAxios from '../../../../hooks/useAxios';
import { alert } from '../../../../components/atoms/Toast';
// import EditTask from './EditTask';
import PopupConfirmation from '../../../../components/popup/PopupConfirmation';
import Popup from '../../../../components/popup/Popup';
import AttachmentButton from '../attachmentButton/AttachmentButton';
import NotesButton from '../notesButton/NotesButton';
import Type from '../type/Type';

const TaskItem = ({ daily, isChecked, onCheck, refetch }) => {
  console.log(isChecked, onCheck);
  const auth = JSON.parse(localStorage.getItem('auth'));
  console.log('auth Item Review', auth);
  const roles = auth?.user?.roles || [];
  const isManager = roles.some((role) => role === 'Manager');
  const isSupervisor = roles.some((role) => role === 'Supervisor');

  const [isLoading, setIsLoading] = useState(false);
  const [isApproveTaskOpen, setIsApproveTaskOpen] = useState(false);
  const [isReviseTaskOpen, setIsReviseTaskOpen] = useState(false);
  const [revisiReason, setRevisiReason] = useState('');
  const api = useAxios();

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

  // const handleReviseTask = () => {
  //   setIsLoading(true);
  //   api
  //     .put(`api/daily/change-status`, { id: daily?.id, status: 'revised' })
  //     .then(() => {
  //       refetch();
  //       alert('success', 'Status task berhasil diubah!');
  //     })
  //     .catch((e) => {
  //       alert('error', e.response.data.message);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //       setIsReviseTaskOpen(false);
  //     });
  // };

  return (
    <>
      <tr className="task-item">
        <td width="30">{/* <Check checked={isChecked} action={onCheck} /> */}</td>
        <td width="500">{daily?.activity_name}</td>
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
            isChange={
              daily?.status === 'in progress' ||
              daily?.status === 'revised' ||
              ((isManager || isSupervisor) && daily?.status.includes('review'))
            }
            refetch={refetch}
          />
        </td>
        <td width="100">
          <Progress
            color={
              daily?.status?.includes('review')
                ? 'blue'
                : daily?.status === 'approved'
                ? 'green'
                : 'yellow'
            }
            taskId={daily?.id}
            progress={daily?.progress}
            isChange={daily?.status === 'in progress' || daily?.status === 'revised'}
            refetch={refetch}
          />
        </td>
        <td width="200">
          <Timeline dateRange={daily?.date_range} />
        </td>
        <td width="100">
          <>
            <MoreMenu
              menus={actionMenus}
              taskStatus={daily?.status}
              isLoading={isLoading}
              refetch={refetch}
            />
          </>
        </td>
        <td width="100">
          <div className="d-flex justify-content-end gap-2 align-items-center">
            {/* <Button
              actionFn={() => {}}
              color="grey"
              icon="comment"
              text=""
              size="sm"
              badge
              badgeColor="red"
              badgeCount={4}
            ></Button>
            <Button
              actionFn={() => {}}
              color="grey"
              icon="attach_file"
              text=""
              size="sm"
              badge
              badgeColor="grey"
              badgeCount={2}
            ></Button> */}

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

          {/* <Popup
            isOpen={isReviseTaskOpen}
            togglePopup={toggleReviseTask}
            title="Revise Task"
            closeButton
            children={
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
            }
          /> */}

          {/* <PopupConfirmation
            isOpen={isReviseTaskOpen}
            toggle={toggleReviseTask}
            loading={isLoading}
            title="Revise Task"
            message="Apakah kamu yakin ingin merevisi task ini?"
            handleConfirm={handleReviseTask}
            btnType="btn-success"
          /> */}
        </td>
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
