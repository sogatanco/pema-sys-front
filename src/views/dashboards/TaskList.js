import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Spinner } from 'reactstrap';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import CircularPercentage from '../../components/atoms/circularPercentage/CircularPercentage';
import { alert } from '../../components/atoms/Toast';
import TaskPopup from '../../pages/projects/TaskPopup';

const TaskList = ({ title, type }) => {
  const { auth } = useAuth();
  const [taskIdSelected, setTaskIdSelected] = useState();
  const [task, setTask] = useState(undefined);
  const [addingFavorite, setAddingFavorite] = useState();
  const [modal, setModal] = useState(false);
  const api = useAxios();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: [`tasklist-${type}`],
    queryFn: () =>
      // api.get(`api/task/${auth?.user.employe_id}/recent/activity`).then((res) => {
      api
        .get(
          `${
            auth?.user?.roles.includes('Director')
              ? `api/task/director/dashboard/list?type=${type}`
              : `api/task/${auth?.user.employe_id}/recent/activity`
          }`,
        )
        .then((res) => {
          return res.data.data;
        }),
  });

  const handleFavorite = async (taskId) => {
    setTaskIdSelected(taskId);
    setAddingFavorite(true);
    await api
      .post(`api/task/${auth?.user.employe_id}/${taskId}/favorite`)
      .then((res) => {
        refetch();
        alert('success', res.data.message);
      })
      .catch(() => {
        alert('error', 'Bad request.');
      });
    setTaskIdSelected();
    setAddingFavorite(false);
  };

  const toggle = () => {
    setModal(!modal);
  };

  const openPopup = (selectedTask) => {
    setModal(true);
    setTask(selectedTask);
  };

  return (
    <>
      <Card>
        <CardBody
          className="d-flex flex-column gap-1"
          style={{ minHeight: `${type === 'recent' ? '130px' : '400px'}` }}
        >
          <div className="d-flex justify-content-between">
            <CardTitle tag="h4">{title}</CardTitle>
            {type === 'inprogress' && (
              <Link to="director/inprogress-task" style={{ textDecoration: 'none' }}>
                See all
              </Link>
            )}
          </div>
          <div className="d-flex flex-column gap-2 justify-content-center">
            {isLoading ? (
              'Loading...'
            ) : error ? (
              'Something went wrong.'
            ) : data?.length > 0 ? (
              data.map((t, i) => (
                <div key={t.task_id} className="d-flex justify-content-between gap-1">
                  <div
                    className={`d-flex col-sm-${
                      type === 'marked' ? '11' : '12 w-100'
                    } justify-content-between align-items-center p-2 rounded-3 link-item-bordered`}
                    style={{ border: '1px dashed #21C1D6' }}
                  >
                    <Link
                      type="button"
                      className={`d-flex gap-2 col-md-${
                        type === 'done' ? '12' : '10'
                      } align-items-center text-muted`}
                      style={{ fontSize: '13px', textDecoration: 'none' }}
                      // to={`projects/details/${t.project_id}`}
                      onClick={() => openPopup(t)}
                    >
                      <span>{i + 1}</span>
                      <div className="d-flex flex-column col-md-12">
                        <div className="d-flex">
                          <span className="text-dark">
                            {type === 'marked'
                              ? t?.task_title.trim().length > 35
                                ? `${t?.task_title?.substring(0, 35)}...`
                                : t?.task_title
                              : type === 'done'
                              ? t?.task_title.trim().length > 53
                                ? `${t?.task_title?.substring(0, 53)}...`
                                : t?.task_title
                              : t?.task_title.trim().length > 40
                              ? `${t?.task_title?.substring(0, 40)}...`
                              : t?.task_title}
                          </span>
                        </div>
                        <div className="d-flex align-items-end gap-3">
                          <span className="badge text-primary bg-light-primary rounded-pill d-inline-block">
                            {t.status === 0
                              ? 'To do'
                              : t.status === 1
                              ? 'In progress'
                              : t.status === 2
                              ? 'Review'
                              : t.status === 3
                              ? 'Approved'
                              : 'Revision'}
                          </span>
                          <span style={{ fontSize: '12px' }} className="text-muted">
                            Deadline: {t?.end_date}
                          </span>
                        </div>
                      </div>
                    </Link>
                    {type !== 'done' && (
                      <div>
                        <div className="d-flex gap-1 justify-content-center align-items-center">
                          <div className="circular-progress">
                            <CircularPercentage
                              data={parseInt(t.task_progress.toFixed(), 10)}
                              color="red"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {type === 'marked' &&
                    auth?.user.roles.includes('Director') &&
                    (addingFavorite && taskIdSelected === t?.task_id ? (
                      <div className="d-flex align-items-center">
                        <Spinner size="sm" color="warning" />
                      </div>
                    ) : (
                      <abbr
                        title="Mark task"
                        style={{ textDecoration: 'none' }}
                        className="d-flex align-items-center"
                      >
                        <button
                          type="button"
                          className="fav-btn"
                          onClick={() => handleFavorite(t?.task_id)}
                        >
                          <MaterialIcon icon="star" className="is_favorite" />
                        </button>
                      </abbr>
                    ))}
                </div>
              ))
            ) : (
              <div className="d-flex justify-content-center">
                <p className="text-muted">No data yet.</p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
      {modal && <TaskPopup {...{ modal, setModal, toggle, task }} mode="activities" />}
    </>
  );
};

TaskList.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
};

export default TaskList;
