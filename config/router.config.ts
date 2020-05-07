export default [
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/index',
      },
      {
        path: '/index',
        component: '@/pages/Home/index',
      },
      {
        path: '/login',
        component: '@/pages/Login/index',
      },
    ],
  },
];
