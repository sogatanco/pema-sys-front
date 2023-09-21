import { lazy } from 'react';
import Loadable from '../layouts/loader/Loadable';
import RequireAuth from '../components/RequireAuth';
import Login from '../pages/auth/Login';
/****Layouts*****/

const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/BlankLayout')));
const StarterKit = Loadable(lazy(() => import('../pages/Starterkit')));
const ProfilePage = Loadable(lazy(() => import('../pages/profile')));
const ProjectPage = Loadable(lazy(() => import('../pages/projects')));
const ProjectDetail = Loadable(lazy(() => import('../pages/projects/ProjectDetail')));
/***** Pages ****/

const Dashboard2 = Loadable(lazy(() => import('../views/dashboards/Dashboard2')));
const Unauthorized = Loadable(lazy(() => import('../pages/auth/Unauthorized')));

/***** CASL Access Control ****/
// const CASL = Loadable(lazy(() => import('../views/apps/accessControlCASL/AccessControl')));

/***** Auth Pages ****/
// const Error = Loadable(lazy(() => import('../views/auth/Error')));
// const RegisterFormik = Loadable(lazy(() => import('../views/auth/RegisterFormik')));
// const Maintanance = Loadable(lazy(() => import('../views/auth/Maintanance')));
// const LockScreen = Loadable(lazy(() => import('../views/auth/LockScreen')));
// const RecoverPassword = Loadable(lazy(() => import('../views/auth/RecoverPassword')));

const ROLES = {
  SuperAdmin: 'Super Admin',
  Admin: 'Admin',
  Director: 'Director',
  Manager: 'Manager',
  Supervisor: 'Supervisor',
  Staff: 'Staff',
  Employee: 'Employee',
};

/*****Routes******/
const ThemeRoutes = [
  // PROTECTED ROUTES
  {
    path: '/',
    element: <RequireAuth allowedRoles={[ROLES.Employee]} />,
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
          {
            path: 'projects',
            name: 'Projects',
            element: <ProjectPage />,
          },
          {
            path: 'projects/details/:projectId',
            name: 'Project Details',
            element: <ProjectDetail />,
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

  // Unauthorized
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      {
        path: 'unauthorized',
        name: 'Unauthorized',
        element: <Unauthorized />,
      },
    ],
  },
  // Unauthorized
];

export default ThemeRoutes;
