import { lazy } from 'react';
import Loadable from '../layouts/loader/Loadable';
import RequireAuth from '../components/RequireAuth';
import Login from '../pages/auth/Login';
/****Layouts*****/

const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/BlankLayout')));
const StarterKit = Loadable(lazy(() => import('../pages/Starterkit')));
const ProfilePage = Loadable(lazy(() => import('../pages/profile')));
/***** Pages ****/

const Dashboard2 = Loadable(lazy(() => import('../views/dashboards/Dashboard2')));

/***** CASL Access Control ****/
// const CASL = Loadable(lazy(() => import('../views/apps/accessControlCASL/AccessControl')));

/***** Auth Pages ****/
// const Error = Loadable(lazy(() => import('../views/auth/Error')));
// const RegisterFormik = Loadable(lazy(() => import('../views/auth/RegisterFormik')));
// const Maintanance = Loadable(lazy(() => import('../views/auth/Maintanance')));
// const LockScreen = Loadable(lazy(() => import('../views/auth/LockScreen')));
// const RecoverPassword = Loadable(lazy(() => import('../views/auth/RecoverPassword')));

const ROLES = {
  Admin: 'Admin',
  Employe: 'Employe',
};

/*****Routes******/
const ThemeRoutes = [
  // PROTECTED ROUTES
  {
    path: '/',
    element: <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Employe]} />,
    children: [
      {
        path: '/',
        element: <FullLayout />,
        children: [
          {
            path: '',
            name: 'Dashboard',
            element: <Dashboard2 />,
          },
          {
            path: 'profile',
            name: 'Profile',
            element: <ProfilePage />,
          },
          {
            path: 'starterkit',
            name: 'Starterkit',
            element: <StarterKit />,
          },
        ],
      },
    ],
  },
  // PROTECTED ROUTES

  // LOGIN ROUTE
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      {
        path: 'login',
        name: 'Login',
        element: <Login />,
      },
    ],
  },
  // LOGIN ROUTE
];

export default ThemeRoutes;
