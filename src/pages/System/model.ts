import { Effect } from 'dva';
import { updateWebUserInfo } from '@/services/system';
import { message } from 'antd';

export interface StateType {}

export interface SystemModelType {
  namespace: string;
  state: StateType;
  effects: {
    doUpdateWebUserInfo: Effect;
  };
  reducers: {};
}

const Modal: SystemModelType = {
  namespace: 'system',
  state: {},
  effects: {
    // 更改个人信息
    *doUpdateWebUserInfo({ payload }, { call, put }) {
      const response = yield call(updateWebUserInfo, payload);
      if (response && response.code === '1') {
        message.success('更改个人信息成功');
      }
    },
  },
  reducers: {},
};

export default Modal;
