import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import Progress from '../progress/Progress';
import Check from '../check/Check';
import Timeline from '../timeline/Timeline';
import MoreMenu from '../moreMenu/MoreMenu';
import useAxios from '../../../../hooks/useAxios';
import { alert } from '../../../../components/atoms/Toast';
import EditTask from './EditTask';

const TaskItem = ({ daily, isChecked, onCheck, refetch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
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

  const toggleEditTask = () => {
    setIsEditTaskOpen(!isEditTaskOpen);
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
              <Check checked={isChecked} action={onCheck} />
            </td>
            <td width="500">{daily?.activity_name}</td>
            <td width="100">
              <Progress
                color={
                  daily?.status === 'review'
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
                <Button
                  actionFn={() => {
                    toggleEditTask();
                  }}
                  color="grey"
                  icon="edit_document"
                  text=""
                  size="sm"
                ></Button>
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
