enum userRoles {
  Admin = 'admin',
  Accounts = 'accounts',
  Office = 'office',
  Factory = 'factory',
}


export const menuConfig = [
  {
    to: '/admin/dashboard',
    title: 'Dashboard',
    icon: 'element-11',
    fontIcon: 'bi-app-indicator',
    roles: [userRoles.Admin, userRoles.Accounts, userRoles.Office, userRoles.Factory],
  },
  {
    to: '/site/users-list',
    title: 'User Management',
    icon: 'user',
    fontIcon: 'bi-layers',
    roles: [userRoles.Admin],
  },
  {
    to: '/site/machines-list',
    title: 'Machine Management',
    icon: 'setting-4',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin],
  },
  {
    to: '/site/customer-management',
    title: 'Customer Management',
    icon: 'profile-circle',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin],
  },
  {
    to: '/site/vendor-management',
    title: 'Vendor Management',
    icon: 'abstract-15',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin],
  },
  {
    to: '/site/sale-representative-management',
    title: 'Sales Representative',
    icon: 'user-tick',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin],
  },
  {
    title: 'Inventory Management',
    icon: 'grid-frame',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin, userRoles.Office, userRoles.Factory],
    children: [
      { to: '/inventory/purchase-order', title: 'Purchase Order Products', hasBullet: true, roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory] },
      { to: '/inventory/job-card', title: 'Job Card Products', hasBullet: true, roles: [userRoles.Admin, userRoles.Factory] },
      { to: '/inventory/recycle', title: 'Recycle Products', hasBullet: true, roles: [userRoles.Admin, userRoles.Factory] },
    ]
  },
  {
    title: 'Orders Management',
    icon: 'handcart',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory],
    children: [
      { to: '/site/purchase-orders-list', title: 'Purchase Orders List', hasBullet: true, roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory] },
      { to: '/site/create-order', title: 'Create Order', hasBullet: true, roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory] },
    ],
  },
  {
    title: 'GRN Vouchers',
    icon: 'abstract-27',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin, userRoles.Accounts],
    children: [
      { to: '/grn/vochers-list', title: 'GRN Vouchers List', hasBullet: true, roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory] },
      { to: '/grn/create-voucher', title: 'Create GRN Voucher', hasBullet: true, roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory] },
    ],
  },
  {
    title: 'Job Card Management',
    icon: 'abstract-43',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin, userRoles.Office, userRoles.Factory],
    children: [
      { to: '/job-management/cards-list', title: 'Job Card List', hasBullet: true, roles: [userRoles.Admin, userRoles.Office] },
      { to: '/job-management/production-entries', title: 'Production Entries', hasBullet: true, roles: [userRoles.Admin, userRoles.Factory] },
    ],
  },
  {
    to: '/sale-invoice/list',
    title: 'Sale Invoice',
    icon: 'abstract-43',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin],
  },
  {
    title: 'Reports',
    icon: 'abstract-44',
    fontIcon: 'bi-archive',
    roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory],
    children: [
      { to: '/reports/dispatch-info', title: 'Job Dispatch Info', hasBullet: true, roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory] },
      { to: '/reports/machine-based', title: 'Machine Based Report', hasBullet: true, roles: [userRoles.Admin, userRoles.Accounts, userRoles.Factory] },
    ],
  },
];
