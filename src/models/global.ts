import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryCountryDropList } from '@/services/global';

export interface StateType {
  collapsed: boolean;
  countryDropList: any[];
}

export interface GlobalModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCountryDropList: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<StateType>;
    saveCountryDropList: Reducer<StateType>;
  };
}

const model: GlobalModelType = {
  namespace: 'global',
  state: {
    collapsed: false,
    countryDropList: [],
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
  },
};

export default model;

const convertList = list => {
  return list.filter(o => o);
};
