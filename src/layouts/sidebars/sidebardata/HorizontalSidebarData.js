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
  { caption: 'Projects' },
  {
    title: 'Projects',
    href: '/projects',
    id: 2,
    // suffix: '4',
    // suffixColor: 'bg-info',
    icon: <MaterialIcon icon="speed" />,
    collapisble: true,
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
