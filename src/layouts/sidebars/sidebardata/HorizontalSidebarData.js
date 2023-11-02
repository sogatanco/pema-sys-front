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
    ddType: 'two-column',
    collapisble: true,
    allowedRoles: ['Employee'],
    children: [
      {
        title: 'Project',
        href: '/projects',
        icon: <MaterialIcon icon="work_history" />,
      },
      {
        title: 'Daily',
        href: '/daily',
        icon: <MaterialIcon icon="event" />,
      },
    ],
  },
  { caption: 'Ticket' },
  {
    title: 'Ticket',
    href: '/tickets',
    id: 3,
    icon: <MaterialIcon icon="description" />,
    collapisble: true,
    allowedRoles: ['Employee'],
  },
  { caption: 'Form' },
  {
    title: 'Form',
    id: 4,
    icon: <MaterialIcon icon="list_alt" />,
    ddType: 'two-column',
    collapisble: true,
    allowedRoles: ['Picpentry', 'Picatk'],
    children: [
      {
        title: 'Pentry',
        href: 'forms/pentry',
        icon: <MaterialIcon icon="restaurant_menu" />,
      },
      {
        title: 'ATK',
        href: 'forms/atk',
        icon: <MaterialIcon icon="home_repair_service" />,
      },
    ],
  },
  { caption: 'Reports' },
  {
    title: 'Report',
    id: 5,
    icon: <MaterialIcon icon="list_alt" />,
    ddType: 'two-column',
    collapisble: true,
    allowedRoles: ['Picpentry', 'Picatk'],
    children: [
      {
        title: 'Pentry Report',
        href: 'reports/pentry',
        icon: <MaterialIcon icon="restaurant_menu" />,
      },
      {
        title: 'ATK Report',
        href: 'reports/atk',
        icon: <MaterialIcon icon="home_repair_service" />,
      },
    ],
  },
  // { caption: 'Starter Kit' },
  // {
  //   title: 'Starter Kit',
  //   href: '/starterkit',
  //   id: 3,
  //   icon: <MaterialIcon icon="grid_view" />,
  //   ddType: 'two-column',
  //   collapisble: true,
  // },
];

export default SidebarData;
