import { Effect } from 'dva';
import { Reducer } from 'redux';
import { delay } from 'dva/saga';
import { routerRedux } from 'dva/router';
import {
  queryUserBaseInfomation,
  queryCountryDropList,
  queryGlobalPackageTypeList,
  sendUuidLogin,
} from '@/services/global';
import { SetGlobalFlag, SetGlobalToken, SetAccountInfo } from '@/utils/cache';

export interface StateType {
  collapsed: boolean;
  countryDropList: any[];
  globalPackageTypeList: any[];
}

export interface GlobalModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCountryDropList: Effect;
    getGlobalPackageTypeList: Effect;
    getGlobalUserInfo: Effect;
    uuidLogin: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<StateType>;
    saveCountryDropList: Reducer<StateType>;
    saveGlobalPackageTypeList: Reducer<StateType>;
  };
}

const model: GlobalModelType = {
  namespace: 'global',
  state: {
    collapsed: false,
    countryDropList: [],
    globalPackageTypeList: [],
  },

  effects: {
    *getCountryDropList({ payload }, { call, put, select }) {
      const response = yield call(queryCountryDropList, payload);
      const countryDropList  = yield select(state => state.global.countryDropList);

      if (countryDropList.length) return;

      if (response && response.code === '1') {
        yield put({
          type: 'saveCountryDropList',
          payload: response.resMap.countryList,
        });
      }
    },
    *getGlobalPackageTypeList({ payload }, { call, put }) {
      const response = yield call(queryGlobalPackageTypeList, payload);

      if (response && response.code === '1') {
        yield put({
          type: 'saveGlobalPackageTypeList',
          payload: response.resMap.dictionaryList,
        });
      }
    },
    *getGlobalUserInfo(_, { call }) {
      const response = yield call(queryUserBaseInfomation);

      if (response && response.code === '1') {
        yield SetAccountInfo(response.resMap.loginUser);
      }
    },
    *uuidLogin({ payload }, { call, put }) {
      const response = yield call(sendUuidLogin, payload);

      if (response && response.code === '1') {
        // yield SetAccountInfo(response.resMap.loginUser);
        if (response.resMap.user && response.resMap.user.token) {
          SetGlobalFlag(response.resMap.user.head);
          SetGlobalToken(response.resMap.user.head, response.resMap.user.token);
          SetAccountInfo(response.resMap.user);

          yield delay(1000);

          return true;
        } else {
          yield put(routerRedux.push('/login'));
        }
      }
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveCountryDropList(state, { payload }) {
      return {
        ...state,
        countryDropList: convertList(payload),
      };
    },
    saveGlobalPackageTypeList(state, { payload }) {
      return {
        ...state,
        globalPackageTypeList: payload,
      };
    },
  },
};

export default model;

const convertList = list => {
  return list.filter(o => o);
};
