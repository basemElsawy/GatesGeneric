import { ParentSideModel } from '../Interfaces/navs.model';
// '../../assets/nav-icon/basic.svg'
// '../../assets/nav-icon/basic.svg'
// '../../assets/nav-icon/pound.svg'
// '../../assets/nav-icon/system.svg'
// '../../assets/nav-icon/system.svg'
// '../../assets/nav-icon/report-svgrepo-com (1).svg'
export const SideRoutes: ParentSideModel[] = [
  {
    name: 'المستخدمين ',
    id: 1,
    active: false,
    icon: 'fa-solid fa-users',
    children: [
      {
        name: 'الصلاحيات',
        route: '/View/User/Permission',
        active: false,
      },
      {
        name: 'المجموعات',
        route: '/View/User/Group',
        active: false,
      },
      {
        name: 'المستخدمين',
        route: '/View/User/Users',
        active: false,
      },
    ],
  },
  {
    name: 'البيانات الأساسية',
    id: 1,
    active: false,
    icon: 'fa-solid fa-database',
    children: [
      {
        name: 'الطرق',
        route: '/View/BasicData/Roads',
        active: false,
      },
      {
        name: 'المحافظات',
        route: '/View/BasicData/govs',
        active: false,
      },
      {
        name: 'البوابات',
        route: '/View/BasicData/Gates',
        active: false,
      },
      {
        name: 'الاتجاهات',
        route: '/View/BasicData/Direction',
        active: false,
      },
      {
        name: 'الحارات',
        route: '/View/BasicData/Lane',
        active: false,
      },
      {
        name: 'كاميرات',
        route: '/View/BasicData/Camira',
        active: false,
      },
      {
        name: 'كاميرات NPN',
        route: '/View/BasicData/CamiraNPR',
        active: false,
      },
      {
        name: ' زاع',
        route: '/View/BasicData/GateArm',
        active: false,
      },
      {
        name: 'سعر الكيلو',
        route: '/View/BasicData/kiloprice',
        active: false,
      },
      {
        name: 'أنواع البضائع',
        route: '/View/BasicData/cargoType',
        active: false,
      },
      {
        name: ' الاوزان',
        route: '/View/BasicData/weightCode',
        active: false,
      },

      {
        name: 'نوع عملية الشحن',
        route: '/View/BasicData/shippingType',
        active: false,
      },
    ],
  },
  {
    name: ' الاسعار',
    id: 2,
    active: false,
    icon: 'fa-solid fa-money-check-dollar',
    children: [
      {
        name: 'فئات المركبات',
        route: '/View/Pricing/VehicleClass',
        active: false,
      },
      {
        name: 'جدوال الاسعار',
        route: '/View/Pricing/PriceTable',
        active: false,
      },
      // {
      //   name: 'جدوال الاستقطاعات',
      //   route: '/View/Pricing/Deduction',
      //   active: false,
      // },
      {
        name: 'تفاصيل الاسعار',
        route: '/View/Pricing/priceDetails',
        active: false,
      },
    ],
  },
  {
    name: ' متابعة النظام',
    id: 2,
    active: false,
    icon: 'fa-solid fa-user-gear',
    children: [
      {
        name: 'متابعة التحصيل',
        route: '/View/SystemView/Home',
        active: false,
      },
      {
        name: 'متابعة الموازين',
        route: '/View/SystemView/weightDetails',
        active: false,
      },
    ],
  },

  {
    name: 'نظام الاشتراكات',
    id: 3,
    active: false,
    icon: 'fa-solid fa-building-user',
    children: [
      {
        name: 'الاشتراكات',
        route: '/View/Subscription/subscription',
        active: false,
      },

      {
        name: 'انشاء اشتراك جديد',
        route: '/View/Subscription/newSubscription',
        active: false,
      },

      {
        name: 'اضافة مدة الاشتراك',
        route: '/View/Subscription/subscriptionDuration',
        active: false,
      },

      {
        name: 'اضافة اسعار الاشتراكات',
        route: '/View/Subscription/subscriptionprices',
        active: false,
      },
    ],
  },

  {
    name: 'التقارير',
    id: 4,
    active: false,
    icon: 'fa-regular fa-clipboard',
    children: [
      {
        name: 'اجمالي عمليات فئات المركبات',
        route: 'View/Report/totalOperation',
        active: false,
      },

      {
        name: 'تقارير بيان الايراد اليومي',
        route: 'View/Report/dialyResults',
        active: false,
      },

      {
        name: 'احصائيات المحطة',
        route: 'View/Report/staticalDetails',
        active: false,
      },

      {
        name: 'بيان تفصيلي بإجمالي ايرادات التحصيل',
        route: 'View/Report/stationDetails',
        active: false,
      },
      {
        name: 'بيان ايرادات الموازين اليومية',
        route: 'View/Report/weightsreport',
        active: false,
      },
    ],
  },
];
// <i class=></i>
// <i class=></i>
/*
 },
  {
    name: 'MemberShips',
    id: 2,
    active: false,
    icon: '../../../../assets/images/navbar-icons/membership.svg',
    children: [
      {
        name: 'New',
        route: 'un',
        active: false,
      },
      {
        name: 'Database',
        route: '/app/dashboard/submissions/moca/members/membersdatabase',
        active: false,
      },
    ],
  },
  {
    name: 'Bookings',
    id: 3,
    active: false,
    icon: '../../../../assets/images/navbar-icons/Bookings.svg',
    children: [
      {
        name: 'Workspace',
        route: '/app/dashboard/submissions/bookings/workspaces',
        active: false,
      },
      {
        name: 'Meeting Space',
        route: '/app/dashboard/submissions/bookings/meetingspaces',
        active: false,
      },
      {
        name: 'Biz Lounge',
        route: '/app/dashboard/submissions/bookings/bizlounge',
        active: false,
      },
      {
        name: 'Eventspace',
        route:
          '/app/dashboard/submissions/bookings/eventspaces/eventspacebookings/3',
        active: false,
      },
    ],
  },
  {
    name: 'Payments',
    id: 4,
    active: false,
    icon: '../../../../assets/images/navbar-icons/payment.svg',
    children: [
      {
        name: 'Wallet',
        route: '/app/dashboard/submissions/wallet',
        active: false,
      },
    ],
  },
  {
    name: 'Feedbacks',
    id: 5,
    active: false,
    icon: '../../../../assets/images/navbar-icons/feedback.svg',
    children: [
      {
        name: 'Report A Bug',
        route: '/app/dashboard/operations/teamreport/reportabuglist',
        active: false,
      },
      {
        name: 'Satisfaction Survey',
        route: '#',
        active: false,
      },
      {
        name: 'Suggest an improvement',
        route: '#',
        active: false,
      },
      {
        name: 'Team Report',
        route: '/app/dashboard/operations/teamreport/teamreportlisting',
        active: false,
      },
    ],
  },
  {
    name: 'Biz Development',
    id: 6,
    active: false,
    icon: '../../../../assets/images/navbar-icons/BizDevelopment.svg',
    children: [
      {
        name: 'Corporate Deals',
        route: '/app/dashboard/operations/teamreport/coporatedealslist',
        active: false,
      },
      {
        name: 'Locations Roll Out',
        route: '#',
        active: false,
      },
    ],
  },
  {
    name: 'Manage',
    id: 7,
    icon: '../../../../assets/images/navbar-icons/manage.svg',
    active: false,

    children: [
      {
        name: 'User Management',
        subChildren: [
          {
            name: 'User',
            route: '/app/dashboard/manage/usermanagement/users',
            active: false,
          },
          {
            name: 'Role',
            route: '/app/dashboard/manage/usermanagement/roles',
            active: false,
          },
        ],
        active: false,
      },
      {
        name: 'Property Management',
        subChildren: [
          {
            name: 'Manage Locations',
            route:
              '/app/dashboard/manage/propertymanagement/managelocations/alllocations',
            active: false,
          },
          {
            name: 'Locations Database',
            route: 'not-yet-specified',
            active: false,
          },
          {
            name: 'Dynamic List',
            route: 'not-yet-specified',
            active: false,
          },
        ],
        active: false,
      },
      {
        name: 'moca settings',
        route: 'not-yet-specified',
        active: false,
      },
    ],
  },
  {
    name: 'Communication',
    route:
      'app/dashboard/manage/systemsettings/scales/communications/createopporyunity/1',
    id: 8,
    icon: '../../../../assets/images/navbar-icons/communication.svg',
    active: false,
  },
  {
    name: 'Security',
    id: 9,
    active: false,
    icon: '../../../../assets/images/navbar-icons/security.svg',
    children: [
      {
        name: 'Access Control Devices',
        route: 'not-yet-specified',
        active: false,
      },
      {
        name: 'Access Control Report',
        route: 'not-yet-specified',
        active: false,
      },
    ],
  },
  {
    name: 'Reports',
    id: 10,
    active: false,
    icon: '../../../../assets/images/navbar-icons/reports.svg',
    children: [
      {
        name: 'Bookings',
        route: 'not-yet-specified',
        active: false,
      },
    ],
  },
*/
