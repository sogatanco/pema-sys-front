import { lazy } from 'react';
import Loadable from '../layouts/loader/Loadable';
import RequireAuth from '../components/RequireAuth';
import Login from '../pages/auth/Login';
/****Layouts*****/

const FullLayout = Loadable(lazy(() => import('../layouts/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/BlankLayout')));
const StarterKit = Loadable(lazy(() => import('../pages/Starterkit')));

/***** Profile ****/
const ProfilePage = Loadable(lazy(() => import('../pages/profile')));
/***** Profile ****/

/***** Daily ****/
const DailyPage = Loadable(lazy(() => import('../pages/daily')));
/***** Daily ****/

/***** Asset ****/
const AssetPage = Loadable(lazy(() => import('../pages/asset')));
const DetailAsset = Loadable(lazy(() => import('../pages/asset/DetailAsset')));
/***** Asset ****/

/***** Projects ****/
const ProjectPage = Loadable(lazy(() => import('../pages/projects')));

const ProjectDetail = Loadable(lazy(() => import('../pages/projects/ProjectDetail')));
const ProjectTaskList = Loadable(lazy(() => import('../pages/projects/AllTask')));
const ProjectReport = Loadable(lazy(() => import('../pages/projects/Report')));
/***** Projects ****/

/***** Tickets ****/
const TicketPage = Loadable(lazy(() => import('../pages/tickets')));
/***** Tickets ****/

/***** Vendor ****/
const DashboardPage = Loadable(lazy(() => import('../pages/vendor/dashboard/Dashboard')));
const VendorCompanyPage = Loadable(lazy(() => import('../pages/vendor/Company')));
const RequestPage = Loadable(lazy(() => import('../pages/vendor/requests/Request')));
const VerificationPage = Loadable(lazy(() => import('../pages/vendor/checks/DocumentCheck')));
const NewTenderPage = Loadable(lazy(() => import('../pages/vendor/tender/NewTender')));
const UpdateTenderPage = Loadable(lazy(() => import('../pages/vendor/tender/EditTender')));
const VendorCompanyDetail = Loadable(lazy(() => import('../pages/vendor/CompanyDetail')));
/***** Vendor ****/

/***** Forms ****/
const PentryPage = Loadable(lazy(() => import('../pages/form/Pentry')));
const AtkPage = Loadable(lazy(() => import('../pages/form/Atk')));
/***** Forms ****/

/***** Forms ****/
const PentryReportPage = Loadable(lazy(() => import('../pages/report/PentryReport')));
const AtkReportPage = Loadable(lazy(() => import('../pages/report/AtkReport')));
/***** Forms ****/

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
  Presdir: 'Presdir',
  Director: 'Director',
  Manager: 'Manager',
  Supervisor: 'Supervisor',
  Staff: 'Staff',
  Employee: 'Employee',
};

const formAllowedRoles = ['Picpentry', 'Picatk'];
const vendorAllowedRoles = ['AdminVendor'];
const reportAllowedRoles = ['Picpentry', 'Picatk'];

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
            path: 'daily',
            name: 'Daily',
            element: <DailyPage />,
          },
          {
            path: 'inventory',
            name: 'Inventory',
            element: <AssetPage />,
          },
          {
            path: 'inventory/:assetId',
            name: 'Detail Inventory',
            element: <DetailAsset />,
          },
          {
            path: 'projects/details/:projectId',
            name: 'Project Details',
            element: <ProjectDetail />,
          },
          {
            path: 'projects/alltask/:projectId',
            name: 'Projects',
            element: <ProjectTaskList />,
          },
          {
            path: 'tickets',
            name: 'Tickets',
            element: <TicketPage />,
          },
          {
            path: 'vendor',
            name: 'Vendor',
            element: <RequireAuth allowedRoles={vendorAllowedRoles} />,
            children: [
              {
                path: '',
                name: 'Dashboard',
                element: <DashboardPage />,
              },
              {
                path: 'company/:companyId',
                name: 'company detail',
                element: <VendorCompanyDetail />,
              },
              {
                path: 'company',
                name: 'company',
                element: <VendorCompanyPage />,
              },
              {
                path: 'requests',
                name: 'Requests',
                element: <RequestPage />,
              },
              {
                path: 'requests/check/:id',
                name: 'Verification',
                element: <VerificationPage />,
              },
              {
                path: 'new-tender',
                name: 'New Tender',
                element: <NewTenderPage />,
              },
              {
                path: 'update-tender/:id',
                name: 'Update Tender',
                element: <UpdateTenderPage />,
              },
            ],
          },
          {
            path: 'forms',
            name: 'Form',
            element: <RequireAuth allowedRoles={formAllowedRoles} />,
            children: [
              {
                path: 'pentry',
                name: 'Pentry',
                element: <PentryPage />,
              },
              {
                path: 'atk',
                name: 'Atk',
                element: <AtkPage />,
              },
            ],
          },
          {
            path: 'reports',
            name: 'Report',
            element: <RequireAuth allowedRoles={reportAllowedRoles} />,
            children: [
              {
                path: 'pentry',
                name: 'Pentry',
                element: <PentryReportPage />,
              },
              {
                path: 'atk',
                name: 'Atk',
                element: <AtkReportPage />,
              },
            ],
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

  // report page
  {
    path: '/',
    children: [
      {
        path: 'projects/:projectId/task-report',
        name: 'Task Report',
        element: <ProjectReport />,
      },
    ],
  },
  // report page

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
