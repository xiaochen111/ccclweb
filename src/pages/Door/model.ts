import { Effect } from 'dva';
import { lclList } from '@/services/lcl';

export interface StateType {
  result: any[];
  totalCount: number;
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
    result: [],
    totalCount: 0,
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
        result: payload.result,
        totalCount: payload.totalCount,
      };
    },
  },
};
export default model;
