// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill')
  },
  {
    title: 'manage order',
    path: '/dashboard/order',
    icon: getIcon('bxs:dish')
  },
  {
    title: 'manage dish',
    path: '/dashboard/dish',
    icon: getIcon('bx:food-menu')
  },
  {
    title: 'manage material',
    path: '/dashboard/material',
    icon: getIcon('ic:baseline-inventory-2')
  },
  {
    title: 'Suppliers',
    path: '/dashboard/suppliers',
    icon: getIcon('carbon:delivery-truck')
  },
  {
    title: 'Kitchen Performance',
    path: '/dashboard/kitchen',
    icon: getIcon('bi:graph-up')
  }
];

export default sidebarConfig;
