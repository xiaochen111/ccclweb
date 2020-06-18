import { Effect } from 'dva';
import { Reducer } from 'redux';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  contactAddress,
  saveContactAddress,
  updateContactAddress,
  deleteContactAddress,
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
    doDeleteContactAddress: Effect;
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
      const response = yield call(contactAddress, payload);

      if (response && response.code === '1') {
        yield put({
          type: 'saveAddressList',
          payload: response.resMap.contactListByPage,
        });
        return true;
      }
    },
    *getDefaultAddress({ payload }, { call, put }) {
      const response = yield call(queryDefaultAddress, payload);

      if (response && response.code === '1') {
        return response.resMap;
      }
    },
    *doSaveContactAddress({ payload }, { call }) {
      const response = yield call(saveContactAddress, payload);

      if (response && response.code === '1') {
        message.success('新增成功');
        return true;
      }
    },
    *doUpdateContactAddress({ payload }, { call }) {
      const response = yield call(updateContactAddress, payload);

      if (response && response.code === '1') {
        message.success('修改成功');
        return true;
      }
    },
    *doDeleteContactAddress({ payload }, { call }) {
      const response = yield call(deleteContactAddress, payload);

      if (response && response.code === '1') {
        message.success('删除成功');
        return true;
      }
    },
    *doSetContactDefaultAddress({ payload }, { call }) {
      const response = yield call(setContactDefaultAddress, payload);

      if (response && response.code === '1') {
        message.success('设置默认地址成功');
        return true;
      }
    },
    *doCancelContactDefaultAddress({ payload }, { call }) {
      const response = yield call(cancelContactDefaultAddress, payload);

      if (response && response.code === '1') {
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
