import { Effect } from 'dva';
import { updateWebUserInfo, updateUserPwd } from '@/services/system';
import { message } from 'antd';

export interface StateType {}

export interface SystemModelType {
  namespace: string;
  state: StateType;
  effects: {
    doUpdateWebUserInfo: Effect;
    doUpdateUserPwd: Effect;
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

        yield put({
          type: 'global/getGlobalUserInfo'
        });
      }
    },
    *doUpdateUserPwd({ payload }, { call }) {
      const response = yield call(updateUserPwd, payload);

      if (response && response.code === '1') {
        message.success('更改个人密码成功');
      }
    },
  },
  reducers: {},
};

export default Modal;
