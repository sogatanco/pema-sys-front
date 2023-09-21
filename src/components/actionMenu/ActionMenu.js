import React, { useState } from 'react';
import './ActionMenu.scss';
import { Link } from 'react-router-dom';
import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';

const ActionMenu = ({ data }) => {
  const [actionMenu, setActionMenu] = useState(false);
  return (
    <div className="action">
      <button type="button" className="btn" onClick={() => setActionMenu(true)}>
        <MaterialIcon icon="more_vert" />
      </button>
      {actionMenu && (
        <>
          <div className="action-overlay" onClick={() => setActionMenu(false)} />
          <div className="action-options">
            {/* <Link to={`tasks/${p.project_id}`} className="text-muted">
                                Create Task
                              </Link> */}
            <Link to={`details/${data}`} className="text-muted">
              <MaterialIcon icon="info" />
              Opsi 1
            </Link>
            <Link to="/" className="text-muted">
              <MaterialIcon icon="update" />
              Opsi 2
            </Link>
            <button type="button" className="text-muted" onClick={() => setActionMenu(undefined)}>
              <MaterialIcon icon="delete_outline" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

ActionMenu.propTypes = {
  data: PropTypes.object,
};

export default ActionMenu;
