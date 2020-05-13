import { Reducer } from 'redux';
import { Effect } from 'dva';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { query } from '@/services/login';

export interface StateType {
  employeeList: any[];
  employeeTotal: number;
}

export interface HomeModelType {
  namespace: string;
  state: StateType;
  effects: {
    getTest: Effect;
  };
  reducers: {};
}

const Model: HomeModelType = {
  namespace: 'home',

  state: {
    employeeList: [],
    employeeTotal: 0,
  },

  effects: {
    *getTest({ payload }, { call, put }) {
      console.log(1);
      const response = yield call(query, payload);

      // if (response && response.code === 200) {
      //   yield put({
      //     type: 'saveList',
      //     payload: response.data
      //   })
      // }
    },
  },

  reducers: {},
};

export default Model;
