import React, { useState } from 'react';
import './ActionMenu.scss';
import { Link } from 'react-router-dom';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';

const ActionMenu = ({ menuOptions, taskId, status, action, progress, duplicateFn }) => {
  const [actionMenu, setActionMenu] = useState(false);

  const deleteTask = () => {
    setActionMenu(false);
    action();
  };

  const changeStatusTask = (setStatus) => {
    action(taskId, setStatus);
    setActionMenu(false);
  };

  return (
    <div className="action">
      <button
        type="button"
        className={`btn-option ${actionMenu && 'active'}`}
        onClick={() => setActionMenu(true)}
      >
        <MaterialIcon icon="more_vert" />
      </button>
      {actionMenu && (
        <>
          <div className="action-overlay" onClick={() => setActionMenu(false)} />
          <div className="action-options rounded-3">
            {menuOptions?.options.map((op) => (
              <div key={op.id}>
                {op.to === 'duplicate' ? (
                  <button
                    type="button"
                    className="text-muted"
                    disabled
                    onClick={() => duplicateFn(taskId)}
                  >
                    {op.icon}
                    Duplicate
                  </button>
                ) : op.type === 'button' ? (
                  <button
                    type="button"
                    className="text-muted"
                    onClick={() => changeStatusTask(op.to)}
                    disabled={
                      op.to === status ||
                      (op.to === 2 && status === 0) ||
                      (op.to === 2 && status === 4) ||
                      (op.to === 0 && status === 4) ||
                      (op.to === 2 && progress !== 100)
                    }
                  >
                    {op.icon}
                    {op.label}
                  </button>
                ) : op.type === 'link' ? (
                  <Link className="text-muted" onClick={op.to}>
                    {op.icon}
                    {op.label}
                  </Link>
                ) : (
                  <div className="action-del">
                    <button type="button" onClick={deleteTask}>
                      <MaterialIcon icon="delete_outline" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

ActionMenu.propTypes = {
  menuOptions: PropTypes.object,
  taskId: PropTypes.number,
  status: PropTypes.number,
  action: PropTypes.func,
  progress: PropTypes.number,
  duplicateFn: PropTypes.func,
};

export default ActionMenu;
