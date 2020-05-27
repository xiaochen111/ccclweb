import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryOrderList, queryOrderDetail, queryOrderFeeDetail, sendCancelOrder, queryPaymentOrCode, sendOrderFeeConfirm } from '@/services/order';
import { ORDER_TATUS_DESC, ORDER_TATUS_COLOR, ORDER_FEE_STATUS_DESC, ORDER__FEE_STATUS_COLOR } from '@/utils/const';

export interface StateType {
  orderList: any[];
  orderTotal: number;
  orderDetail: any;
  payTypeQrcode: null;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    getOrderList: Effect;
    getOrderDetail: Effect;
    getOrderFeeDetail: Effect;
    cancelOrder: Effect;
    getQrcode: Effect;
    orderFeeConfirm: Effect
  };
  reducers: {
    saveOrderList: Reducer<StateType>;
    saveOrderListDetail: Reducer<StateType>;
    saveQrcode: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'order',

  state: {
    orderList: [],
    orderTotal: 0,
    orderDetail: null,
    payTypeQrcode: null
  },

  effects: {
    *getOrderList({ payload }, { call, put, select }) {
      const response = yield call(queryOrderList, payload);

      if (response && response.code === '1') {
        yield put({
          type: 'saveOrderList',
          payload: response.resMap.page,
        });
      }
    },
    *getOrderDetail({ payload }, { call, put }) {
      const response = yield call(queryOrderDetail, payload);

      if (response && response.code === '1') {
        yield put({
          type: 'saveOrderListDetail',
          payload: response.resMap.order,
        });
      }
    },
    *getOrderFeeDetail({ payload }, { call, put }) {
      const response = yield call(queryOrderFeeDetail, payload);

      if (response && response.code === '1') {
        return response.resMap.orderPayfee;
      }
    },
    *cancelOrder({ payload }, { call, put }) {
      const response = yield call(sendCancelOrder, payload);

      if (response && response.code === '1') {
        return true;
      }
    },
    *orderFeeConfirm({ payload }, { call }) {
      const response = yield call(sendOrderFeeConfirm, payload);

      if (response && response.code === '1') {
        return true;
      }
    },
    *getQrcode({ payload }, { call, put }) {
      const response = yield call(queryPaymentOrCode, payload);

      if (response && response.code === '1') {
        yield put({
          type: 'saveQrcode',
          payload: response.resMap.qrCodeUrl,
        });
      }
    }
  },

  reducers: {
    saveOrderList(state, { payload }) {
      return {
        ...state,
        orderList: convertList(payload.result),
        orderTotal: payload.totalCount,
      };
    },
    saveOrderListDetail(state, { payload }) {
      return {
        ...state,
        orderDetail: payload,
      };
    },
    saveQrcode(state, { payload }) {
      console.log('saveQrcode -> payload', payload);
      return {
        ...state,
        payTypeQrcode: payload
      };
    }
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
      feeStatus: item.feeStatus !== undefined ? item.feeStatus : -1,
      feeStatusDesc: ORDER_FEE_STATUS_DESC[item.feeStatus] ? ORDER_FEE_STATUS_DESC[item.feeStatus] : '- - - - -',
      feeStatusColor: ORDER__FEE_STATUS_COLOR[item.feeStatus ? item.feeStatus : 0],
    });
  }

  return result;
};
