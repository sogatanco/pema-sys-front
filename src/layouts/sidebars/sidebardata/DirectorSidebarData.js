import MaterialIcon from '@material/react-material-icon';

const DirectorSidebarData = [
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
        title: 'Daily',
        href: '/daily',
        icon: <MaterialIcon icon="event" />,
      },
    ],
  },
];

export default DirectorSidebarData;
