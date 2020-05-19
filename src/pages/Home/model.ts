import { Reducer } from 'redux';
import { Effect } from 'dva';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export interface StateType {}

export interface HomeModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCountryDrop: Effect;
  };
  reducers: {};
}

const Model: HomeModelType = {
  namespace: 'home',

  state: {},

  effects: {
    *getCountryDrop({ payload }, { call, put }) {},
  },

  reducers: {
    // setDropCountry(state, { payload }) {
    //   return {
    //     ...state,
    //     dropCountry: payload,
    //   };
    // },
  },
};

export default Model;
