import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { contactAddress, saveContactAddress } from '@/services/address';

export interface StateType {
  addressList: any[];
  addressTotal: number;
}

export interface AddressModelType {
  namespace: string;
  state: StateType;
  effects: {
    getContactAddress: Effect;
    doSaveContactAddress: Effect;
  };
  reducers: {};
}

const Modal: AddressModelType = {
  namespace: 'address',
  state: {
    addressList: [],
    addressTotal: 0,
  },
  effects: {
    *getContactAddress({ payload }, { call, put }) {
      const respone = yield call(contactAddress, payload);
      if (respone && respone.code === '1') {
        yield put({
          type: 'saveAddressList',
          payload: respone.code,
        });
      }
    },
    *doSaveContactAddress({ payload }, { call }) {
      const respone = yield call(saveContactAddress, payload);
      if (respone && respone.code === '1') {
        return true;
      }
    },
  },
  reducers: {
    saveAddressList(state, { payload }) {
      return {
        ...state,
        addressList: payload,
        addressTotal: payload,
      };
    },
  },
};

export default Modal;
