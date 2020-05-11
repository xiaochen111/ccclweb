import { IConfig } from 'umi-types';
import pageRoutes from './router.config';
const path = require('path');

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: pageRoutes,
  publicPath: '/',
  alias: {
    resources: path.resolve('./public/'),
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
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
      },
    ],
  ],
  ignoreMomentLocale: true,
  history: 'hash',
  hash: true,
  theme: {
    'text-color': '#333',
    'text-color-secondary': '#999',
    'border-color-base': '#ccc',
    'btn-default-bg': 'linear-gradient(46deg,rgba(13,70,239,1) 0%,rgba(22,165,255,1) 100%)',
  },
  targets: {
    ie: 9,
  },
};

export default config;
