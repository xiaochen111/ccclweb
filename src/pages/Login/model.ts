import { Reducer } from 'redux';
import { Effect } from 'dva';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryCaptchImage, doLogin, sendRegistPhoneMsg, registerPhone } from '@/services/login';
import { SetGlobalToken } from '@/utils/cache';

export interface StateType {
  captchaImage: any;
  setCountdown: boolean;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCaptchImage: Effect;
    sendLoginInfo: Effect;
    getPhoneRegiseMsg: Effect;
    registerPhone: Effect;
  };
  reducers: {};
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    captchaImage: {},
    setCountdown: false,
  },

  effects: {
    // 获取图片验证码
    *getCaptchImage(_, { call, put }) {
      const response = yield call(queryCaptchImage);
      if (response && response.code === '1') {
        yield put({
          type: 'saveCaptchaImage',
          payload: response.resMap.capt,
        });
      }
    },

    //登录
    *sendLoginInfo({ payload }, { call, put }) {
      const response = yield call(doLogin, payload);
      console.log(response);
      if (response && response.code === '1') {
        SetGlobalToken(response.resMap.user.token);
        yield put(routerRedux.push('/home'));
      }
    },

    // 获取短信验证码
    *getPhoneRegiseMsg({ payload }, { call, put }) {
      const response = yield call(sendRegistPhoneMsg, payload);
      if (response && response.code === '1') {
        return true;
      }
    },

    // 手机注册
    *registerPhone({ payload }, { call, put }) {
      const response = yield call(registerPhone, payload);
      if (response && response.code === '1') {
        return true;
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
