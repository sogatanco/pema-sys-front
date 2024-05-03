import React, { useState } from 'react';
import './Bell.scss';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import NotificationList from './NotificationList';

const Bell = ({ setShowTask, setTaskId }) => {
  const [openNotif, setOpenNotif] = useState(false);

  return (
    <div className="bell-container">
      {openNotif && <NotificationList {...{ setOpenNotif, setShowTask, setTaskId }} />}
      <div className="bell-button">
        <div className="bell-icon" onClick={() => setOpenNotif(!openNotif)}>
          <MaterialIcon icon="notifications" />
          <div className="total">
            <span>0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Bell.propTypes = {
  setShowTask: PropTypes.func,
  setTaskId: PropTypes.func,
};

export default Bell;
