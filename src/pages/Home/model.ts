import { Reducer } from 'redux';
import { Effect } from 'dva';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export interface StateType {}

export interface HomeModelType {
  namespace: string;
  state: StateType;
  effects: {};
  reducers: {};
}

const Model: HomeModelType = {
  namespace: 'home',

  state: {},

  effects: {},

  reducers: {},
};

export default Model;
