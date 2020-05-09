import { IConfig } from 'umi-types';
import pageRoutes from './router.config';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: pageRoutes,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
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
      },
    ],
  ],
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
