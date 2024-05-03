import MaterialIcon from '@material/react-material-icon';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import newDate from '../../utils/formatDate';
import user1 from '../../assets/images/users/user1.jpg';

const NotificationList = ({ setOpenNotif, setShowTask, setTaskId }) => {
  const handleShowTask = (id) => {
    setShowTask(true);
    setTaskId(id);
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
        <div className="not-item" onClick={() => handleShowTask(31)}>
          <div className="not-header">
            <div className="not-header-info">
              <h6 className="text-primary fw-bold">Rahmat Riski</h6>
              <span>Manager Teknikal Operasi</span>
            </div>
            <img src={user1} className="rounded-circle" alt="avatar" width="28" height="28" />
          </div>
          <div className="not-body">
            <div className="not-content">Menyutujui task Anda</div>
          </div>
          <div className="not-footer">
            <span>{newDate(Date.now())}</span>
            <div className="delete">
              <span></span>
              <MaterialIcon icon="delete" />
            </div>
          </div>
        </div>
        <div className="not-item" onClick={() => handleShowTask(22)}>
          <div className="not-header">
            <div className="not-header-info">
              <h6 className="text-primary fw-bold">Sadikin Nugraha</h6>
              <span>Manager Divisi Perindustrian dan Perdagangan</span>
            </div>
            <img src={user1} className="rounded-circle" alt="avatar" width="28" height="28" />
          </div>
          <div className="not-body">
            <div className="not-content">Memberikan Anda sebuah additional task</div>
          </div>
          <div className="not-footer">
            <span>{newDate(Date.now())}</span>
            <div className="delete">
              <span></span>
              <MaterialIcon icon="delete" />
            </div>
          </div>
        </div>
        <div className="not-item">
          <div className="not-header">
            <div className="not-header-info">
              <h6 className="text-primary fw-bold">Muhammad Mulia</h6>
              <span>Staf Divisi Industri dan Perdagangan</span>
            </div>
            <img src={user1} className="rounded-circle" alt="avatar" width="28" height="28" />
          </div>
          <div className="not-body">
            <div className="not-content">Menandai Anda dalam sebuah komentar</div>
          </div>
          <div className="not-footer">
            <span>{newDate(Date.now())}</span>
            <div className="delete">
              <span>Wait a moment..</span>
              {/* <MaterialIcon icon="delete" /> */}
            </div>
          </div>
        </div>
        <div className="not-item">
          <div className="not-header">
            <div className="not-header-info">
              <h6 className="text-primary fw-bold">
                Ali Mulyagusdin <span className="text-muted">Memberikan komentar</span>
              </h6>
              <span>Direktur Utama</span>
            </div>
            <img src={user1} className="rounded-circle" alt="avatar" width="28" height="28" />
          </div>
          <div className="not-body">
            <div className="not-content">
              <i>{`"Tolong dibuatkan dokumen pengesahannya.."`}</i>
            </div>
          </div>
          <div className="not-footer">
            <span>{newDate(Date.now())}</span>
            <div className="delete">
              <span></span>
              <MaterialIcon icon="delete" />
            </div>
          </div>
        </div>
      </div>
      <div className="checkall">
        <Button type="button" color="primary" size="sm" className="mt-2 rounded-3">
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
};

export default NotificationList;
