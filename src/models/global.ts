import { Effect } from 'dva';
import { Reducer } from 'redux';
import {
  queryUserBaseInfomation,
  queryCountryDropList,
  queryGlobalPackageTypeList,
} from '@/services/global';

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
    *getCountryDropList({ payload }, { call, put }) {
      const response = yield call(queryCountryDropList, payload);

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
          payload: response.resMap.countryList,
        });
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
        globalPackageTypeList: [],
      };
    },
  },
};

export default model;

const convertList = list => {
  return list.filter(o => o);
};
