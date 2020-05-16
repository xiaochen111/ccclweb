import { Effect } from 'dva';

export interface StateType {}

export interface SearchConditionModelType {
  namespace: string;
  state: StateType;
  effects: {
    getCaptchImage: Effect;
  };
  reducers: {};
}

const model: SearchConditionModelType = {
  namespace: 'searchConditions',
  state: {
    a: 1,
  },
  effects: {
    *getCaptchImage() {},
  },
  reducers: {},
};
export default model;
