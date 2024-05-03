import React, { useEffect, useState } from 'react';
import './TaskDetail.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MaterialIcon from '@material/react-material-icon';
import { Badge } from 'reactstrap';
import EditTab from './EditTab';
import CommentTab from './CommentTab';
import LogTab from './LogTab';
import FileTab from './FileTab';
import useAxios from '../../hooks/useAxios';
import IndoDate from '../../utils/IndoDate';
import OverviewTab from './OverviewTab';

const TaskDetail = ({ showTask, setShowTask, taskId }) => {
  const [tabActive, setTabActive] = useState(2);
  const [data, setData] = useState({});

  const api = useAxios();

  const fetchTask = async () => {
    await api
      .get(`api/task/${taskId}/show`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  useEffect(() => {
    if (showTask === true) {
      document.body.style.overflow = 'hidden'; // ADD THIS LINE
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = 'auto'; // ADD THIS LINE
      document.body.style.height = 'auto';
    }
  }, [showTask]);

  return (
    <div className={`task-container ${showTask ? 'show' : ''}`}>
      <div className="task-content">
        <div className="task-title">
          <h5 className="fw-bold">Task Detail</h5>
          <button type="button" onClick={() => setShowTask(!showTask)}>
            <MaterialIcon icon="close" />
          </button>
        </div>
        <div className="wrap">
          {taskId !== data?.task_id ? (
            <div className="d-flex justify-content-center p-5">
              <p>Loading..</p>
            </div>
          ) : (
            <>
              <div className="task-header">
                <div className="project-name">
                  <span>Task Title</span>
                  <h5>{data?.task_title}</h5>
                </div>
                <div className="attrib">
                  <div className="item">
                    <MaterialIcon icon="today" />
                    <div className="sub-item">
                      <span>Start date</span>
                      <h6>{IndoDate(data?.start_date)}</h6>
                    </div>
                  </div>
                  <div className="item">
                    <MaterialIcon icon="event" />
                    <div className="sub-item">
                      <span>Due date</span>
                      <h6>{IndoDate(data?.end_date)}</h6>
                    </div>
                  </div>
                  <div className="item">
                    <div className="">
                      {data?.status === 0 ? (
                        <Badge color="info">To Do</Badge>
                      ) : data?.status === 1 ? (
                        <Badge color="primary">In Progress</Badge>
                      ) : data?.status === 2 ? (
                        <Badge color="light" className="text-dark">
                          <i className="bi-clock mr-4" style={{ fontSize: '12px' }}></i>
                          &nbsp; Waiting for approval<strong></strong>
                        </Badge>
                      ) : data?.status === 3 ? (
                        <Badge color="success" className="d-flex">
                          {' '}
                          <i className="bi-check2-circle mr-4" style={{ fontSize: '13px' }}></i>
                          &nbsp; Approved
                        </Badge>
                      ) : (
                        <Badge color="danger">Revision</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="task-body">
                <div className="sidebar">
                  <Link
                    className={`${tabActive === 1 ? 'active' : ''}`}
                    onClick={() => setTabActive(1)}
                  >
                    Overview
                  </Link>
                  <Link
                    className={`${tabActive === 2 ? 'active' : ''}`}
                    onClick={() => setTabActive(2)}
                  >
                    Edit
                  </Link>
                  <Link
                    className={`${tabActive === 3 ? 'active' : ''}`}
                    onClick={() => setTabActive(3)}
                  >
                    Comment
                    <div className="count">
                      <span>2</span>
                    </div>
                  </Link>
                  <Link
                    className={`${tabActive === 4 ? 'active' : ''}`}
                    onClick={() => setTabActive(4)}
                  >
                    Log
                  </Link>
                  <Link
                    className={`${tabActive === 5 ? 'active' : ''}`}
                    onClick={() => setTabActive(5)}
                  >
                    Attachment
                  </Link>
                </div>
                <div className="data">
                  {tabActive === 1 ? (
                    <OverviewTab />
                  ) : tabActive === 2 ? (
                    <EditTab {...{ data, fetchTask }} />
                  ) : tabActive === 3 ? (
                    <CommentTab {...{ data, fetchTask }} />
                  ) : tabActive === 4 ? (
                    <LogTab />
                  ) : (
                    <FileTab />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

TaskDetail.propTypes = {
  showTask: PropTypes.bool,
  setShowTask: PropTypes.func,
  taskId: PropTypes.number,
};

export default TaskDetail;
