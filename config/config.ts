<<<<<<< HEAD
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
=======
import { IConfig } from 'umi-types';
import pageRoutes from './router.config';

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  routes: pageRoutes,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      dll: false,
      
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  targets: {
    ie: 9,
  },
}

export default config;
>>>>>>> umi-old
