export default [
  { 
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/', redirect: '/index',
      },
      {
        path: '/index',
        component: './Home/index'
      }
    ] 
  }
]