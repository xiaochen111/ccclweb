import { Effect } from 'dva';
import { delay } from 'dva/saga';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryOrderList } from '@/services/order';
import { ORDER_TATUS_DESC, ORDER_TATUS_COLOR, ORDER_FEE_STATUS_DESC } from '@/utils/const';

export interface StateType {
  orderList: any[];
  orderTotal: number;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    getOrderList: Effect;
  };
  reducers: {};
}

const Model: LoginModelType = {
  namespace: 'order',

  state: {
    orderList: [],
    orderTotal: 0,
  },

  effects: {
    *getOrderList({ payload }, { call, put }) {
      const response = yield call(queryOrderList, payload);
      if (response && response.code === '1') {
        yield put({
          type: 'saveOrderList',
          payload: response.resMap.page,
        });
      }
    },
  },

  reducers: {
    saveOrderList(state, { payload }) {
      return {
        ...state,
        orderList: convertList(payload.result),
        orderTotal: payload.totalCount,
      };
    },
  },
};

export default Model;

const convertList = list => {
  let result = [];

  for (let i in list) {
    let item = list[i];

    result.push({
      ...item,
      statusDesc: ORDER_TATUS_DESC[item.status],
      statusColor: ORDER_TATUS_COLOR[item.status],
      feeStatusDesc: ORDER_FEE_STATUS_DESC[item.feeStatus ? item.feeStatus : 0],
    });
  }

  return result;
};
