import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  contactAddress,
  saveContactAddress,
  updateContactAddress,
  setContactDefaultAddress,
  cancelContactDefaultAddress,
  queryDefaultAddress
} from '@/services/address';

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
    doUpdateContactAddress: Effect;
    doSetContactDefaultAddress: Effect;
    doCancelContactDefaultAddress: Effect;
    getDefaultAddress: Effect;
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
          payload: respone.resMap.contactListByPage,
        });
        return true;
      }
    },
    *getDefaultAddress({ payload }, { call, put }) {
      const respone = yield call(queryDefaultAddress, payload);

      if (respone && respone.code === '1') {
        return respone.resMap;
      }
    },
    *doSaveContactAddress({ payload }, { call }) {
      const respone = yield call(saveContactAddress, payload);

      if (respone && respone.code === '1') {
        message.success('新增成功');
        return true;
      }
    },
    *doUpdateContactAddress({ payload }, { call }) {
      const respone = yield call(updateContactAddress, payload);

      if (respone && respone.code === '1') {
        message.success('修改成功');
        return true;
      }
    },
    *doSetContactDefaultAddress({ payload }, { call }) {
      const respone = yield call(setContactDefaultAddress, payload);

      if (respone && respone.code === '1') {
        message.success('设置默认地址成功');
        return true;
      }
    },
    *doCancelContactDefaultAddress({ payload }, { call }) {
      const respone = yield call(cancelContactDefaultAddress, payload);

      if (respone && respone.code === '1') {
        message.success('取消默认地址成功');
        return true;
      }
    },
  },
  reducers: {
    saveAddressList(state, { payload }) {
      return {
        ...state,
        addressList: payload.result,
        addressTotal: payload.totalCount || 0,
      };
    },
  },
};

export default Modal;
