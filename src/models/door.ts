import { Effect } from 'dva';
import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import moment from 'moment';
import { queryLclList, queryLclDetail, doOrderSubmit, queryLclTotalPrice, queryLclSupplierDetail } from '@/services/lcl';

export interface StateType {
  lclList: any[];
  totalCount: number;
  lclOrderInfo: any;
  lclTotalPriceInfo: any;
}

export interface DoorModelType {
  namespace: string;
  state: StateType;
  effects: {
    getLclList: Effect;
    getLclDetail: Effect;
    orderSubmit: Effect;
    getTotalPrice: Effect;
    getLclSupplierDetail: Effect;
  };
  reducers: {
    setLclList: Reducer<StateType>;
    saveLclOrderInfo: Reducer<StateType>;
    saveLclTotalPrice: Reducer<StateType>;
  };
}

const model: DoorModelType = {
  namespace: 'door',
  state: {
    lclList: [],
    totalCount: 0,
    lclOrderInfo: null,
    lclTotalPriceInfo: {},
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
    *orderSubmit({ payload }, { call }) {
      const response = yield call(doOrderSubmit, payload);

      if (response && response.code === '1') {
        // message.success('委托成功');
        return true;
        // yield put(routerRedux.push('/control/order/my'));
      }
    },
    *getTotalPrice({ payload }, { call, put }) {
      const response = yield call(queryLclTotalPrice, payload);

      if (response && response.code === '1') {
        yield put({
          type: 'saveLclTotalPrice',
          payload: response.resMap,
        });
      }
    },
    *getLclSupplierDetail({ payload }, { call }) {
      const response = yield call(queryLclSupplierDetail, payload);

      if (response && response.code === '1') {
        return response.resMap.detail;
      }
    },
  },
  reducers: {
    setLclList(state, { payload }) {
      console.log('setLclList -> payload', payload);
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
    saveLclTotalPrice(state, { payload }) {
      return {
        ...state,
        lclTotalPriceInfo: payload,
      };
    },
  },
};

export default model;

const convertOrderInfo = info => {
  return {
    ...info,
    startTime: moment(new Date(info.startTime)).format('YYYY-MM-DD'),
    endTime: moment(new Date(info.endTime)).format('YYYY-MM-DD'),
  };
};
