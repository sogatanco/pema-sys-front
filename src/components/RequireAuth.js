import React, { useContext } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { AuthContext } from '../context/AuthContext';

const RequireAuth = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  return auth ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />;
  //   return user?.roles?.find((role) => allowedRoles?.includes(role)) ? (
  //     <Navigate to="/auth/login" state={{ from: location }} replace />
  //   ) : user?.user ? (
  //     <Navigate to="/unauthorized" state={{ from: location }} replace />
  //   ) : (
  //     <Outlet />
  //   );
};

// RequireAuth.propTypes = {
//   allowedRoles: PropTypes.any,
// };

export default RequireAuth;
