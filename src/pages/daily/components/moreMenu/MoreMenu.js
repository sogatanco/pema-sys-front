import React, { useState } from 'react';
import './MoreMenu.scss';
// import MaterialIcon from '@material/react-material-icon';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import Label from '../label/Label';

const MoreMenu = ({ menus, taskStatus, isLoading, isChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isActive = isChange;
  // const isActive = taskStatus === 'in progress' || taskStatus === 'revised';

  return (
    <>
      {isOpen && <div className="more-menu-overlay" onClick={() => setIsOpen(!isOpen)} />}
      <div className="more-menu">
        <div
          className={`menu-button ${isActive ? 'active' : ''}`}
          // onClick={() => (taskStatus === 'in progress' || taskStatus === 'revised' ? setIsOpen(!isOpen) : '')}
          onClick={() => (isChange ? setIsOpen(!isOpen) : '')}
        >
          {isLoading ? (
            <div className="d-flex gap-2 align-items-center">
              <Spinner animation="border" size="sm" color="success" />
              <span>Loading..</span>
            </div>
          ) : (
            <>
              {taskStatus === 'in progress' && <Label color="yellow" text="In Progress" />}
              {taskStatus === 'approved' && <Label color="green" text="Done" />}
              {taskStatus?.includes('review') && <Label color="blue" text="Review" />}
              {taskStatus === 'revised' && <Label color="red" text="Revised" />}
              {taskStatus === 'cancelled' && <Label color="orange" text="Cancelled" />}
            </>
          )}
        </div>
        {isOpen && (
          <>
            <div className="menu-list">
              {menus?.map((menu) => (
                <div
                  key={menu.id}
                  className="item"
                  onClick={() => {
                    menu.action();
                    setIsOpen(false);
                  }}
                >
                  {menu.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

MoreMenu.propTypes = {
  menus: PropTypes.array,
  taskStatus: PropTypes.string,
  isLoading: PropTypes.bool,
  isChange: PropTypes.bool,
};

export default MoreMenu;
