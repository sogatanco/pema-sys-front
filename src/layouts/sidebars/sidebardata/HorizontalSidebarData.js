import MaterialIcon from '@material/react-material-icon';

const SidebarData = [
  { caption: 'Home' },
  {
    title: 'Dashboard',
    href: '/',
    id: 1,
    // suffix: '4',
    // suffixColor: 'bg-info',
    icon: <MaterialIcon icon="home" />,
    collapisble: true,
    allowedRoles: ['Employee'],
  },
  { caption: 'Activity' },
  {
    title: 'Activity',
    href: '/activity',
    id: 2,
    icon: <MaterialIcon icon="engineering" />,
    // ddType: 'two-column',
    collapisble: true,
    allowedRoles: ['Employee'],
    children: [
      {
        title: 'Project',
        href: '/projects',
        allowedRoles: ['Staff', 'Manager'],
        icon: <MaterialIcon icon="work_history" />,
      },
      {
        title: 'Timeline',
        href: '/timeline',
        allowedRoles: ['Staff', 'Manager'],
        icon: <MaterialIcon icon="timeline" />,
      },
      {
        title: 'Daily',
        href: '/daily',
        allowedRoles: ['Employee'],
        icon: <MaterialIcon icon="event" />,
      },
    ],
  },

  // { caption: 'Ticket' },
  // {
  //   title: 'Ticket',
  //   href: '/tickets',
  //   id: 3,
  //   icon: <MaterialIcon icon="description" />,
  //   collapisble: true,
  //   allowedRoles: ['Employee'],
  // },

  { caption: 'Asset' },
  {
    title: 'Asset',
    href: '/asset ',
    id: 4,
    icon: <MaterialIcon icon="grid_view" />,
    ddType: 'two-column',
    allowedRoles: ['Employee'],
    collapisble: true,
  },
  { caption: 'Vendor' },
  {
    title: 'Vendor',
    id: 5,
    icon: <MaterialIcon icon="diversity_3" />,
    ddType: 'four-column',
    allowedRoles: ['AdminVendorUmum', 'AdminVendorScm', 'VendorViewer'],
    collapisble: true,
    children: [
      {
        title: 'Dashboard',
        href: '/vendor',
        allowedRoles: ['AdminVendorUmum', 'AdminVendorScm', 'VendorViewer'],
        icon: <MaterialIcon icon="dashboard" />,
      },
      {
        title: 'Company List',
        href: '/vendor/company',
        allowedRoles: ['AdminVendorUmum', 'AdminVendorScm', 'VendorViewer'],
        icon: <MaterialIcon icon="business" />,
      },
      // {
      //   title: 'Tender List',
      //   href: '/daily',
      //   allowedRoles: ['AdminVendorUmum', 'AdminVendorScm'],
      //   icon: <MaterialIcon icon="rebase_edit" />,
      // },
      {
        title: 'Requests',
        href: 'vendor/requests',
        allowedRoles: ['AdminVendorUmum', 'AdminVendorScm'],
        icon: <MaterialIcon icon="fact_check" />,
      },
      {
        title: 'New Tender',
        href: 'vendor/new-tender',
        allowedRoles: ['AdminVendorUmum', 'AdminVendorScm'],
        icon: <MaterialIcon icon="library_add" />,
      },
    ],
  },
  { caption: 'SPPD' },
  {
    title: 'SPPD',
    href: '/sppd',
    id: 6,
    icon: <MaterialIcon icon="flight_takeoff" />,
    // ddType: '-column',
    allowedRoles: ['Employee'],
  },
  { caption: 'ADM' },
  {
    title: 'ADM',
    href: '/adm',
    id: 7,
    icon: <MaterialIcon icon="history_edu" />,
    // ddType: '-column',
    allowedRoles: ['Employee'],
  },
  { caption: 'Kendaraan' },
  {
    title: 'Kendaraan',
    href: '/mobil-operational',
    id: 8,
    icon: <MaterialIcon icon="directions_car" />,
    // ddType: '-column',
    allowedRoles: ['Employee'],
  },

  
  { caption: 'Pengajuan' },
  {
    title: 'Pengajuan',
    href: '/pengajuan',
    id: 9,
    icon: <MaterialIcon icon="assignment" />,
    allowedRoles: ['AdminPengajuan', 'ManagerUmum', 'DirekturUmumKeuangan', 'Presdir'],
  },

  { caption: 'Report' },
  {
    title: 'Report',
    href: '/insert-image',
    id: 10,
    icon: <MaterialIcon icon="assignment" />,
    allowedRoles: ['AdminLayar'],
  },

  { caption: 'Manual Book' },
  {
    title: 'Manual Book',
    href: '',
    id: 11,
    icon: <MaterialIcon icon="menu_book" />,
    // ddType: 'two-column',
    collapisble: true,
    allowedRoles: ['Employee'],
    children: [
      {
        title: 'Daily Activity',
        href: 'https://drive.google.com/file/d/1U3tmrNP-jWxmt5O4RSvM5Z6kcAqeXQJU/view',
        allowedRoles: ['Employee'],
        icon: <MaterialIcon icon="event" />,
      },
      {
        title: 'Project Management',
        href: 'https://drive.google.com/file/d/16IiswEaaw28YpnOZVrWOCO9pm9V7xZxx/view',
        allowedRoles: ['Employee'],
        icon: <MaterialIcon icon="work_history" />,
      },
      {
        title: 'Aplikasi Asset',
        href: 'https://drive.google.com/file/d/1jVj5zDuPVM4IWSAh04AF38ZkkUh4j1e3/view',
        allowedRoles: ['Employee'],
        icon: <MaterialIcon icon="grid_view" />,
      },
      {
        title: 'Aplikasi SPPD',
        href: 'https://api.ptpema.co.id/sppd/dokumentasi/SPPD.pdf',
        allowedRoles: ['Employee'],
        icon: <MaterialIcon icon="flight_takeoff" />,
      },
      {
        title: 'Aplikasi ADM',
        href: 'https://api.ptpema.co.id/adm/dokumentasi/adm.pdf',
        allowedRoles: ['Employee'],
        icon: <MaterialIcon icon="history_edu" />,
      },
    ],
  },
];

export default SidebarData;
