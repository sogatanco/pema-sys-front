import React, { useState } from 'react';
import './Bell.scss';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import NotificationList from './NotificationList';

const Bell = ({ setShowTask, setTaskId, data }) => {
  const [openNotif, setOpenNotif] = useState(false);

  return (
    <>
      <div
        className={`overlay ${openNotif ? 'overlay-show' : ''}`}
        onClick={() => setOpenNotif(!openNotif)}
      />
      <div className="bell-container">
        {openNotif && <NotificationList {...{ setOpenNotif, setShowTask, setTaskId, data }} />}
        <div className="bell-button">
          <div className="bell-icon" onClick={() => setOpenNotif(!openNotif)}>
            <MaterialIcon icon="notifications" />
            <div className="total">
              <span>{data?.length}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Bell.propTypes = {
  setShowTask: PropTypes.func,
  setTaskId: PropTypes.func,
  data: PropTypes.array,
};

export default Bell;
