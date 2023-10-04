import React from 'react';
import { DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { User, Settings } from 'react-feather';
import user1 from '../../assets/images/users/user4.jpg';
import useAuth from '../../hooks/useAuth';

const ProfileDD = () => {
  const { auth } = useAuth();

  return (
    <div>
      <div className="d-flex gap-3 p-3 border-bottom pt-2 align-items-center">
        <img src={user1} alt="user" className="rounded-circle" width="60" />
        <span>
          <h5 className="mb-0">{auth.user.first_name}</h5>
          <small className="fs-6 text-muted">{auth.user.email}</small>
        </span>
      </div>
      <Link to="/profile" className="text-decoration-none text-dark">
        <DropdownItem className="px-4 py-3">
          <User size={20} />
          &nbsp; My Profile
        </DropdownItem>
      </Link>
      <DropdownItem divider />
      <DropdownItem className="px-4 py-3">
        <Settings size={20} />
        &nbsp; Settings
      </DropdownItem>
      <DropdownItem divider />
    </div>
  );
};

export default ProfileDD;
