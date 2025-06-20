import React, { useContext } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';
// import LoginSso from './LoginSso';

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  // console.log(location?.pathname)

  // const params = new URLSearchParams(location.search);

  // const source = params.get('source') || '';
  // console.log(source);

  return auth?.user?.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/auth/login" state={{ from: location?.pathname }} replace />
  );
};

RequireAuth.propTypes = {
  allowedRoles: PropTypes.any,
};

export default RequireAuth;
