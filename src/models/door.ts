import { Effect } from 'dva';
import { Reducer } from 'redux';
import { lclList } from '@/services/lcl';

export interface StateType {
  lclList: any[];
  totalCount: number;
}

export interface DoorModelType {
  namespace: string;
  state: StateType;
  effects: {
    getLclList: Effect;
  };
  reducers: {
    setLclList: Reducer<StateType>;
  };
}

const model: DoorModelType = {
  namespace: 'door',
  state: {
    lclList: [],
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
        lclList: payload.result,
        totalCount: payload.totalCount,
      };
    },
  },
};
export default model;
