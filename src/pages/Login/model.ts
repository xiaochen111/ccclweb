import { Effect } from 'dva';
import { delay } from 'dva/saga';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  queryCaptchImage,
  doLogin,
  sendRegistPhoneMsg,
  doRegister,
  sendRegistEmailMsg,
  doResetPassword,
  doPhoneSendRepasswordMsg,
  doSendRepasswordEmail,
} from '@/services/login';
import { SetGlobalToken, SetAccountInfo } from '@/utils/cache';

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
    getEmailRegiseMsg: Effect;
    register: Effect;
    resetPassword: Effect;
    getPhoneRepasswordMsg: Effect;
    getEmailRepasswordMsg: Effect;
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

      if (response && response.code === '1') {
        message.success('登录成功');

        yield delay(1000);
        SetAccountInfo(response.resMap.user);
        SetGlobalToken(response.resMap.user.token);
        yield put(routerRedux.push('/home'));
      }
    },

    // 获取短信验证码
    *getPhoneRegiseMsg({ payload }, { call }) {
      const response = yield call(sendRegistPhoneMsg, payload);

      if (response && response.code === '1') {
        return true;
      }
    },
    // 获取忘记密码短信验证码
    *getPhoneRepasswordMsg({ payload }, { call }) {
      const response = yield call(doPhoneSendRepasswordMsg, payload);

      if (response && response.code === '1') {
        return true;
      }
    },

    // 获取邮箱验证码
    *getEmailRegiseMsg({ payload }, { call }) {
      const response = yield call(sendRegistEmailMsg, payload);

      if (response && response.code === '1') {
        return true;
      }
    },

    // 获取忘记密码邮箱验证码
    *getEmailRepasswordMsg({ payload }, { call }) {
      const response = yield call(doSendRepasswordEmail, payload);

      if (response && response.code === '1') {
        return true;
      }
    },

    // 手机、邮箱注册
    *register({ payload }, { call, put }) {
      const response = yield call(doRegister, payload);

      if (response && response.code === '1') {
        message.success('注册成功');
        yield put(routerRedux.push('/login'));
      }
    },

    // 找回密码
    *resetPassword({ payload }, { call, put }) {
      const response = yield call(doResetPassword, payload);

      if (response && response.code === '1') {
        message.success('密码找回成功');
        yield put(routerRedux.push('/login'));
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
