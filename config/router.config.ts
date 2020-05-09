export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/index',
      },
      {
        path: '/index',
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
