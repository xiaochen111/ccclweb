export default [
  {
    path: '/control',
    // Routes: ['src/pages/Authorized'],
    component: '../layouts/ControlLayout',
    routes: [
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
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
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
        path: '/door/place-order',
        component: './Door/PlaceOrder',
      },
    ],
  },
];
