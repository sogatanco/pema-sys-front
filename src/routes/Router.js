import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/loader/Loadable';
/****Layouts*****/

const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/BlankLayout')));
const StarterKit = Loadable(lazy(() => import('../pages/Starterkit')));
const ProfilePage = Loadable(lazy(() => import('../pages/profile')));
/***** Pages ****/

const Dashboard2 = Loadable(lazy(() => import('../views/dashboards/Dashboard2')));

/***** CASL Access Control ****/
const CASL = Loadable(lazy(() => import('../views/apps/accessControlCASL/AccessControl')));

/***** Auth Pages ****/
const Error = Loadable(lazy(() => import('../views/auth/Error')));
const RegisterFormik = Loadable(lazy(() => import('../views/auth/RegisterFormik')));
const LoginFormik = Loadable(lazy(() => import('../views/auth/LoginFormik')));
const Maintanance = Loadable(lazy(() => import('../views/auth/Maintanance')));
const LockScreen = Loadable(lazy(() => import('../views/auth/LockScreen')));
const RecoverPassword = Loadable(lazy(() => import('../views/auth/RecoverPassword')));

/*****Routes******/

const ThemeRoutes = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', name: 'Home', exact: true, element: <Dashboard2 /> },
      { path: '/starterkit', name: 'Starterkit', exact: true, element: <StarterKit /> },
      { path: '/profile', name: 'Profile', exact: true, element: <ProfilePage /> },
      { path: '/casl', name: 'casl', exact: true, element: <CASL /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      { path: 'registerformik', element: <RegisterFormik /> },
      { path: 'loginformik', element: <LoginFormik /> },
      { path: 'maintanance', element: <Maintanance /> },
      { path: 'lockscreen', element: <LockScreen /> },
      { path: 'recoverpwd', element: <RecoverPassword /> },
    ],
  },
];

export default ThemeRoutes;
