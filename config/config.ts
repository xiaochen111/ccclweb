import { defineConfig } from 'umi';
import pageRoutes from './router.config';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: pageRoutes,
});
