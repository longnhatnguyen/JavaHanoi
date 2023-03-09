export const menu = [
  {
    label: 'Trang Chủ',
    title: 'Trang Chủ',
    routerLink: '/dashboard',
    code: 'DASHBOARD',
    role: ['customer'],
    hasChild: false,
    icon: "fa-solid fa-house",
    items: []
  },
  {
    label: 'Quản lý hợp đồng',
    title: 'Quản lý hợp đồng',
    code: 'CONTRACT',
    role: ['customer', 'admin'],
    routerLink: '/contract/contract-management',
    hasChild: false,
    icon: "fa-solid fa-file-contract",
    items: []
  },
  {
    label: 'Quản lý người dùng',
    title: 'Quản lý người dùng',
    code: 'ADMIN',
    role: ['admin'],
    hasChild: true,
    icon: "fa-solid fa-user",
    items: [
      {
        label: 'Quản lý người dùng',
        routerLink: '/user',
      },
      {
        label: 'Quản lý nhóm',
        routerLink: '/user/group',
      },
      {
        label: 'Quản lý phân quyền',
        routerLink: '/user/role',
      },
    ]
  },
  {
    label: 'Quản lý khách hàng',
    title: 'Quản lý khách hàng',
    code: 'CUSTOMER',
    role: ['admin'],
    routerLink: '/customer',
    hasChild: false,
    icon: "fa-solid fa-user-group",
    items: []
  },
  {
    label: 'Danh mục',
    title: 'Danh mục',
    code: 'CATEGORY',
    role: ['admin'],
    hasChild: true,
    icon: "fa-solid fa-bars",
    items: [
      {
        label: 'Quản lý gói đầu tư',
        routerLink: '/category/category-ratio',
      },
      {
        label: 'Quản lý cửa hàng',
        routerLink: '/category/category-store',
      },
      {
        label: 'Quản lý dữ liệu kinh doanh',
        routerLink: '/category/business-info',
      },
    ]
  },
  {
    label: 'Đăng ký hợp đồng mới',
    title: 'Đăng ký hợp đồng mới',
    routerLink: '/contract-signing/0',
    code: 'CONTRACT',
    role: ['customer'],
    hasChild: false,
    nonexact: true,
    icon: "fa-solid fa-user-tie",
    items: []
  },
  // {
  //   label: 'Danh sách người được giới thiệu',
  //   title: 'Danh sách người được giới thiệu',
  //   routerLink: '/customer/invited-list',
  //   code: 'CONTRACT',
  //   role: ['customer','admin'],
  //   hasChild: false,
  //   nonexact: true,
  //   icon: "fa-solid fa-users",
  //   items: []
  // },
  {
    label: 'Quản lý phiên chuyển tiền',
    title: 'Quản lý phiên chuyển tiền',
    code: 'TRANSFER',
    role: ['admin', 'customer'],
    routerLink: '/transfer',
    hasChild: false,
    icon: "fa-solid fa-hand-holding-dollar",
    items: []
  },
  {
    label: 'Chat với khách hàng',
    title: 'Chat với khách hàng',
    code: 'CHAT',
    role: ['admin'],
    routerLink: '/chat',
    hasChild: false,
    icon: "fa-brands fa-rocketchat",
    items: []
  },
  {
    label: 'Danh sách cửa hàng',
    title: 'Danh sách cửa hàng',
    code: 'CATEGORY',
    role: ['customer'],
    routerLink: '/category/category-store',
    hasChild: false,
    icon: "fa-solid fa-store",
    items: []
  },
  {
    label: 'Doanh nghiệp',
    title: 'Doanh nghiệp',
    code: 'ENTERPRISE',
    role: ['customer'],
    hasChild: true,
    icon: "fa-solid fa-building",
    items: [
      {
        label: 'Giới thiệu doanh nghiệp',
        routerLink: '/enterprise/enterprise-intro',
      },
      {
        label: 'Cơ cấu tổ chức',
        routerLink: '/enterprise/enterprise-organizational-structure',
      }
    ]
  },
  {
    label: 'Dẫn chứng hợp đồng điện tử',
    title: 'Dẫn chứng hợp đồng điện tử',
    code: '',
    role: ['customer'],
    routerLink: '/contract/proof-of-econtract',
    hasChild: false,
    icon: "fa-solid fa-file-contract",
    items: []
  },
  {
    label: 'Cấu hình',
    title: 'Cấu hình',
    code: 'CONFIG',
    role: ['admin'],
    routerLink: '/config',
    hasChild: false,
    icon: "fa-solid fa-pager",
    items: []
  },
]
