import { Effect } from 'dva';
import { lclList } from '@/services/lcl';

interface pageInstance {
  result: any[];
  [propName: string]: any;
}

export interface StateType {
  lclPage: pageInstance;
}

export interface DoorModelType {
  namespace: string;
  state: StateType;
  effects: {
    getLclList: Effect;
  };
  reducers: {};
}

const model: DoorModelType = {
  namespace: 'door',
  state: {
    lclPage: {
      result: [] as [],
    },
  },
  effects: {
    *getLclList({ payload }, { call, put }) {
      const response = yield call(lclList, payload);
      if (response && response.code === '1') {
        yield put({
          type: 'setLclList',
          payload: response.resMap.page,
        });
      }
    },
  },
  reducers: {
    setLclList(state, { payload }) {
      return {
        ...state,
        lclPage: payload,
      };
    },
  },
};
export default model;
