export default [
  {
    path: '/control',
    Routes: ['src/pages/Authorized'],
    component: '../layouts/ControlLayout',
    routes: [
      {
        path: '/control',
        redirect: '/control/mdoor',
      },
      {
        path: '/control/mdoor',
        icon: 'area-chart',
        name: '门到门专区',
        component: './Mdoor/index',
        type: 'backend',
      },
      {
        path: '/control/mdoor-order/:id',
        hideInMenu: true,
        component: './Door/PlaceOrder',
        type: 'backend',
      },
      {
        path: '/control/order',
        icon: 'area-chart',
        name: '订单中心',
        routes: [
          {
            path: '/control/order/my',
            name: '我的订单',
            component: './Order/index',
          },
        ],
      },
      {
        path: '/control/general',
        icon: 'area-chart',
        name: '常用信息',
        routes: [
          {
            path: '/control/general/adress',
            name: '我的订单',
            component: './GeneralInfo/Address/index',
          },
        ],
      },
      {
        path: '/control/system',
        icon: 'setting',
        name: '系统中心',
        routes: [
          {
            path: '/control/system/menber',
            name: '会员信息',
            component: './System/Member',
          },
          {
            path: '/control/system/security-setting',
            name: '安全设置',
            component: './System/SecuritySetting',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/hasLogin'],
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: '/home',
        component: './Home/index',
      },
      {
        path: '/login',
        redirect: '/login/index',
      },
      {
        path: '/login/index',
        component: './Login/Login',
      },
      {
        path: '/login/register',
        component: './Login/Register',
      },
      {
        path: '/login/retrievePassword',
        component: './Login/RetrievePassword',
      },
      {
        path: 'door',
        redirect: '/door/index',
      },
      {
        path: '/door/index',
        component: './Door/DoorIndex',
      },
      {
        path: '/door/price-plan',
        component: './Door/PricePlan',
      },
      {
        path: '/door/place-order/:id',
        component: './Door/PlaceOrder',
      },
    ],
  },
];
