import MaterialIcon from '@material/react-material-icon';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import newDate from '../../utils/formatDate';
import user1 from '../../assets/images/users/user1.jpg';
import relax from '../../assets/images/icons/nonotif.png';

const NotificationList = ({ setOpenNotif, setShowTask, setTaskId, data }) => {
  const navigate = useNavigate();
  const handleShowTask = (id) => {
    setShowTask(false);
    setTaskId(id);
  };

  const handleAction = (id, entity, entityId, url, queryKey) => {
    setOpenNotif(false);

    const entitySplit = entityId.split('/');

    console.log('SPLIT', entitySplit[1]);

    navigate(
      `/${url}${entityId !== null ? `/${entitySplit[0]}` : ''}${
        queryKey !== null && entitySplit[1] !== undefined ? `?${queryKey}=${entitySplit[1]}` : ''
      }`,
    );

    if (entity === 'TASK_NEW') {
      handleShowTask(entityId);
    }

    // if (entity === 'TASK') {
    //   handleShowTask(entityId);
    //   navigate(
    //     `/${url}${entityId !== null ? `/${entitySplit[0]}` : ''}${
    //       queryKey !== null ? `?${queryKey}=${entitySplit[1]}` : ''
    //     }`,
    //   );
    // } else {
    //   navigate(`/${url}${entityId !== null ? `/${entityId}` : ''}`);
    // }
    console.log(id + entityId);
  };

  const handleCheck = () => {
    navigate('/all-notifications');
  };

  return (
    <div className="notification-container">
      <div className="not-title">
        <h5 className="fw-bold">Notifications</h5>
        <MaterialIcon icon="close" onClick={() => setOpenNotif(false)} />
      </div>
      {/* <div className="not text-center">
        <div className="not-item">
          <h6>Soon..</h6>
        </div>
      </div> */}
      <div className="not">
        <div className="not-overflow">
          {data?.length > 0 ? (
            data.map((not) => (
              <div
                className="not-item"
                onClick={() =>
                  handleAction(not.id, not.entity, not.entity_id, not.url, not.query_key)
                }
                key={not.id}
              >
                <div className="not-header">
                  <div className="not-header-info">
                    <h6 className="text-primary fw-bold">{not.actor}</h6>
                    <span>{not.position}</span>
                  </div>
                  <img src={user1} className="rounded-circle" alt="avatar" width="28" height="28" />
                </div>
                <div className="not-body">
                  <div className="not-content">
                    <p>
                      {not.message}
                      {/* <i className="text-muted">{`"${cs}"`}</i> */}
                    </p>
                  </div>
                </div>
                <div className="not-footer">
                  <span>{newDate(not.created_at)}</span>
                  <div className="delete">
                    <span></span>
                    <MaterialIcon icon="delete" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <img src={relax} alt="relax" width="150" />
              {/* <span className="text-muted">Relax</span> */}
            </div>
          )}
        </div>
      </div>
      {data.length !== 0 && (
        <div className="checkall">
          <Button
            type="button"
            color="primary"
            size="sm"
            className="mt-2 rounded-3"
            onClick={() => handleCheck()}
            disabled
          >
            Check All
          </Button>
        </div>
      )}
    </div>
  );
};

NotificationList.propTypes = {
  setOpenNotif: PropTypes.func,
  setShowTask: PropTypes.func,
  setTaskId: PropTypes.func,
  data: PropTypes.array,
};

export default NotificationList;
