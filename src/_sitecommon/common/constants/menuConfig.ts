import { UserRole } from "../enums/GlobalEnums";

export const menuConfig = [
  {
    to: '/admin/dashboard',
    title: 'Dashboard',
    icon: 'element-11',
    fontIcon: 'bi-app-indicator',
    roles: [UserRole.Admin, UserRole.Accounts, UserRole.Office, UserRole.Factory],
  },
  {
    to: '/site/users-list',
    title: 'User Management',
    icon: 'user',
    fontIcon: 'bi-layers',
    roles: [UserRole.Admin],
  },
  {
    to: '/site/machines-list',
    title: 'Machine Management',
    icon: 'setting-4',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin],
  },
  {
    to: '/site/customer-management',
    title: 'Customer Management',
    icon: 'profile-circle',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Office],
  },
  {
    to: '/site/vendor-management',
    title: 'Vendor Management',
    icon: 'abstract-15',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Office],
  },
  {
    to: '/site/sale-representative-management',
    title: 'Sales Representative',
    icon: 'user-tick',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Office],
  },
  {
    title: 'Inventory Management',
    icon: 'grid-frame',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Office, UserRole.Factory],
    children: [
      { to: '/inventory/purchase-order', title: 'Purchase Order Products', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory, UserRole.Office] },
      { to: '/inventory/job-card', title: 'Job Card Products', hasBullet: true, roles: [UserRole.Admin, UserRole.Factory] },
      { to: '/inventory/recycle', title: 'Recycle Products', hasBullet: true, roles: [UserRole.Admin, UserRole.Factory] },
    ]
  },
  {
    title: 'Orders Management',
    icon: 'handcart',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory],
    children: [
      { to: '/site/purchase-orders-list', title: 'Purchase Orders List', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory, UserRole.Office] },
      { to: '/site/create-order', title: 'Create Order', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory] },
    ],
  },
  {
    title: 'GRN Vouchers',
    icon: 'abstract-27',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Accounts, UserRole.Office],
    children: [
      { to: '/grn/vouchers-list', title: 'GRN Vouchers List', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Office, UserRole.Factory] },
      { to: '/grn/create-voucher', title: 'Create GRN Voucher', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory] },
    ],
  },
  {
    title: 'Job Card Management',
    icon: 'abstract-43',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Office, UserRole.Factory, UserRole.Office],
    children: [
      { to: '/job-management/cards-list', title: 'Job Card List', hasBullet: true, roles: [UserRole.Admin, UserRole.Office] },
      { to: '/job-management/production-entries', title: 'Production Entries', hasBullet: true, roles: [UserRole.Admin, UserRole.Factory] },
    ],
  },
  {
    to: '/sale-invoice/list',
    title: 'Sale Invoice',
    icon: 'abstract-43',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Office],
  },
  {
    title: 'Reports',
    icon: 'abstract-44',
    fontIcon: 'bi-archive',
    roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory],
    children: [
      { to: '/reports/dispatch', title: 'Dispatch', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Office, UserRole.Factory] },
      { to: '/reports/machine-based', title: 'Machine Based', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory] },
      { to: '/reports/stock', title: 'Stock', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Office, UserRole.Factory] },
      { to: '/reports/job-summary', title: 'Job Summary', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory] },
      { to: '/reports/machine-summary', title: 'Machine Summary', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Factory] },
      { to: '/reports/grn', title: 'GRN', hasBullet: true, roles: [UserRole.Admin, UserRole.Accounts, UserRole.Office, UserRole.Factory] },
    ],
  },
];
