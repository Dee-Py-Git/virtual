// config.js
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

// config.js
const navConfig = (role) => {
  const baseConfig = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: icon('ic_analytics'),
    },
    {
      title: 'users',
      path: '/dashboard/users',
      icon: icon('ic_user'),
    },
    {
      title: 'trainingen',
      path: '/dashboard/trainingen',
      icon: icon('ic_cart'),
    },
    {
      title: 'logout',
      path: '/',
      icon: icon('ic_lock'),
    },
  ];

  if (role !== 'admin') {
    return baseConfig.filter(item => item.title !== 'users');
  }

  return baseConfig; // For admin, return all items
};

export default navConfig;

