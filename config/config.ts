import { defineConfig } from 'umi';
import pageRoutes from './router.config';

export default defineConfig({
  //   nodeModulesTransform: {
  //     type: 'none',
  //   },
  routes: pageRoutes,
  externals: {
    scripts: [
      'https://gw.alipayobjects.com/os/lib/alipay/react16-map-set-polyfill/1.0.2/dist/react16-map-set-polyfill.min.js',
    ],
  },
  targets: {
    ie: 9,
  },
});
