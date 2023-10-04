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
  },
  
  { caption: 'Activity' },
  {
    title: 'Activity',
    href: '/activity',
    id: 2,
    icon: <MaterialIcon icon="engineering" />,
    ddType: 'two-column',
    collapisble: true,
    children: [
      {
        title: 'Project',
        href: '/projects',
        icon: <MaterialIcon icon="work_history" />,
      },
      {
        title: 'Daily Activity',
        href: '/daily',
        icon: <MaterialIcon icon="event" />,
      },
     
    ],
  },
  { caption: 'Starter Kit' },
  {
    title: 'Starter Kit',
    href: '/starterkit',
    id: 3,
    icon: <MaterialIcon icon="grid_view" />,
    ddType: 'two-column',
    collapisble: true,
  },
];

export default SidebarData;
