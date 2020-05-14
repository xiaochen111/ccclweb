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
    getCaptchImage: Effect;
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
    *getCaptchImage(_, { call, put }) {
      const response = yield call(queryCaptchImage, { a: 1 });

      if (response && response.code === 1) {
        yield put({
          type: 'saveCaptchaImage',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    saveCaptchaImage(state, { payload }) {
      return {
        ...state,
        captchaImage: payload,
      };
    },
  },
};

export default Model;
