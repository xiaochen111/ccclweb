import { Reducer } from 'redux';

export interface StateType {
  collapsed: boolean;
}

export interface GlobalModelType {
  namespace: string;
  state: StateType;
  reducers: {
    changeLayoutCollapsed: Reducer<StateType>; // 侧边栏展开关闭
  };
}

const Model: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
  },
};

export default Model;
