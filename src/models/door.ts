import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import moment from 'moment';
import { queryLclList, queryLclDetail, doOrderSubmit } from '@/services/lcl';

export interface StateType {
  lclList: any[];
  totalCount: number;
  lclOrderInfo: any;
}

export interface DoorModelType {
  namespace: string;
  state: StateType;
  effects: {
    getLclList: Effect;
    getLclDetail: Effect;
    orderSubmit: Effect;
  };
  reducers: {
    setLclList: Reducer<StateType>;
    saveLclOrderInfo: Reducer<StateType>;
  };
}

const model: DoorModelType = {
  namespace: 'door',
  state: {
    lclList: [],
    totalCount: 0,
    lclOrderInfo: null,
  },
  effects: {
    *getLclList({ payload }, { call, put }) {
      const response = yield call(queryLclList, payload);
      if (response && response.code === '1') {
        yield put({
          type: 'setLclList',
          payload: response.resMap.page,
        });
      }
    },
    *getLclDetail({ payload }, { call, put }) {
      const response = yield call(queryLclDetail, payload);
      if (response && response.code === '1') {
        yield put({
          type: 'saveLclOrderInfo',
          payload: response.resMap.freightLcl4OrderVo,
        });
      }
    },
    *orderSubmit({ payload }, { call, put }) {
      const response = yield call(doOrderSubmit, payload);

      if (response && response.code === '1') {
        message.success('委托已提交');
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
    saveLclOrderInfo(state, { payload }) {
      return {
        ...state,
        lclOrderInfo: convertOrderInfo(payload),
      };
    },
  },
};
export default model;

const convertOrderInfo = info => {
  console.log(info, '1');
  return {
    ...info,
    startTime: moment(new Date(info.startTime)).format('YYYY-MM-DD'),
    endTime: moment(new Date(info.endTime)).format('YYYY-MM-DD'),
  };
};
