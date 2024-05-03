import React from 'react';
import user1 from '../../assets/images/users/user1.jpg';

const LogTab = () => {
  return (
    <div className="log">
      <div className="content-log">
        <div className="log-list">
          <div className="item">
            <img src={user1} className="rounded-circle" alt="avatar" width="35" height="35" />
            <div className="text">
              <div className="user">
                <h6>Rahmat Riski</h6>
                <span>28 Feb 2023, 10:00</span>
              </div>
              <p>Create this task</p>
            </div>
          </div>
          <div className="item">
            <img src={user1} className="rounded-circle" alt="avatar" width="35" height="35" />
            <div className="text">
              <div className="user">
                <h6>Muhammad Haikal Aulia</h6>
                <span>28 Feb 2023, 10:10</span>
              </div>
              <p>Request to change due date</p>
            </div>
          </div>
          <div className="item">
            <img src={user1} className="rounded-circle" alt="avatar" width="35" height="35" />
            <div className="text">
              <div className="user">
                <h6>Rahmat Riski</h6>
                <span>28 Feb 2023, 10:10</span>
              </div>
              <p>Request due date approved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogTab;
