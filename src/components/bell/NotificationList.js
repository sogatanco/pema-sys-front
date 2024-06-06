import MaterialIcon from '@material/react-material-icon';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import newDate from '../../utils/formatDate';
import user1 from '../../assets/images/users/user1.jpg';

const NotificationList = ({ setOpenNotif, setShowTask, setTaskId, data }) => {
  const navigate = useNavigate();
  const handleShowTask = (id) => {
    setShowTask(true);
    setTaskId(id);
  };

  const handleAction = (id, entity, entityId, url) => {
    setOpenNotif(false);
    if (entity === 'TASK') {
      handleShowTask(entityId);
    } else {
      navigate(`/${url}/${entityId}`);
    }
    console.log(id);
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
          {data?.length > 0 &&
            data.map((not) => (
              <div
                className="not-item"
                onClick={() => handleAction(not.id, not.entity, not.entity_id, not.url)}
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
            ))}
        </div>
      </div>
      <div className="checkall">
        <Button
          type="button"
          color="primary"
          size="sm"
          className="mt-2 rounded-3"
          onClick={() => handleCheck()}
        >
          Check All
        </Button>
      </div>
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
