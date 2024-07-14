import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';

const ProfileNav = (props) => {
  const { toggle, activeTab } = props;

  return (
    <Nav tabs className="profile-tab">
      <NavItem>
        <NavLink
          className={activeTab === '1' ? 'active bg-transparent' : 'cursor-pointer text-muted'}
          onClick={() => {
            toggle('1');
          }}
        >
          Activity
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={activeTab === '2' ? 'active bg-transparent' : 'cursor-pointer text-muted'}
          onClick={() => {
            toggle('2');
          }}
        >
          Personal
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={activeTab === '3' ? 'active bg-transparent' : 'cursor-pointer text-muted'}
          onClick={() => {
            toggle('3');
          }}
        >
          Family
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={activeTab === '4' ? 'active bg-transparent' : 'cursor-pointer text-muted'}
          onClick={() => {
            toggle('4');
          }}
        >
          Account
        </NavLink>
      </NavItem>
    </Nav>
  );
};

ProfileNav.propTypes = {
  toggle: PropTypes.func,
  activeTab: PropTypes.string,
};

export default ProfileNav;
