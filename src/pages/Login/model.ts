import { Reducer } from 'redux';
import { Effect } from 'dva';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryCaptchImage } from '@/services/login';

export interface StateType {
  captchaKey: string;
  captchaImage: any;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
  };
  reducers: {};
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    captchaKey: '',
    captchaImage: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(queryCaptchImage, payload);

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
