import MaterialIcon from '@material/react-material-icon';

const SidebarData = [
  { caption: 'Home' },
  {
    title: 'Dashboard',
    href: '/',
    id: 1,
    // suffix: '4',
    // suffixColor: 'bg-info',
    icon: <MaterialIcon icon="speed" />,
    collapisble: true,
  },
  { caption: 'Basic Menu' },
  {
    title: 'Basic Menu',
    href: '/',
    id: 2,
    icon: <MaterialIcon icon="grid_view" />,
    ddType: 'two-column',
    collapisble: true,
  },
  { caption: 'Dropdown Menu' },
  {
    title: 'Dropdown Menu',
    href: '/',
    icon: <MaterialIcon icon="feed" />,
    id: 4,
    collapisble: true,
    children: [
      {
        title: 'Basic Forms',
        href: '/',
        icon: <MaterialIcon icon="radio_button_checked" />,
      },
    ],
  },
];

export default SidebarData;
