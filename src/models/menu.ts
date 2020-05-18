import { Reducer } from 'redux';
import { Effect } from 'dva';
import memoizeOne from 'memoize-one';
import { isEqual } from 'lodash';

export interface StateType {
  menuData: any[];
  breadcrumbNameMap: any;
  globalPageSubMenu: any;
}

export interface MenuModelType {
  namespace: string;
  state: StateType;
  reducers: {
    getMenuData: Reducer<StateType>;
  };
}

const Model = {
  namespace: 'menu',

  state: {
    menuData: [],
    breadcrumbNameMap: {},
  },
  reducers: {
    getMenuData(state, { payload }) {
      const { routes } = payload;
      const menuData = filterMenuData(memoizeOneFormatter(routes));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);

      return {
        ...state,
        menuData,
        breadcrumbNameMap,
      };
    },
  },
};

export default Model;

// 路由信息转换为对象数组
const formatter = data => {
  return data
    .map(item => {
      if (!item.name || !item.path) return null;

      const result = {
        ...item,
        name: item.name,
      };

      if (item.routes) {
        const children = formatter(item.routes);
        result.children = children;
      }

      delete result.routes;
      return result;
    })
    .filter(item => item);
};

const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }

      routerMap[menuItem.path] = menuItem;
    });
  };

  flattenMenuData(menuData);
  return routerMap;
};

const filterMenuData = menuData => {
  if (!menuData) return [];

  return menuData
    .filter(item => {
      return item.name && !item.hideInMenu;
    })
    .map(item => getSubMenu(item))
    .filter(item => item);
};

const getSubMenu = item => {
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children),
    };
  }
  return item;
};

const memoizeOneFormatter = memoizeOne(formatter, isEqual);
const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);
