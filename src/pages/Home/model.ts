import { Effect } from 'dva';
import { bargainPrice } from '@/services/global';

export interface StateType {
  priceList: Array<any>;
}

export interface HomeModelType {
  namespace: string;
  state: StateType;
  effects: {
    getBargainPrice: Effect;
  };
  reducers: {};
}

const Model: HomeModelType = {
  namespace: 'home',

  state: {
    priceList: [],
  },

  effects: {
    *getBargainPrice({ payload }, { call, put }) {
      const response = yield call(bargainPrice);

      if (response && response.code === '1') {
        yield put({
          type: 'setPriceList',
          payload: response.resMap.list,
        });
      }
    },
  },

  reducers: {
    setPriceList(state, { payload }) {
      return {
        ...state,
        priceList: payload,
      };
    },
  },
};

export default Model;
