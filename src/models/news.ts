import { Effect } from 'dva';

import { webNewsListPage, webQueryNewsById } from '@/services/news';


export interface StateType {
  newsList: any[];
  newDetail:any;
  listTotal: number;
}

export interface NewsModelType {
  namespace: string;
  state: StateType;
  effects: {
    getWebNewsListPage: Effect;
    getWebQueryNewsById: Effect;
  };
  reducers: {};
}

const Model: NewsModelType = {
  namespace: 'news',
  state: {
    newsList: [],
    newDetail: {},
    listTotal: 0,
  },

  effects: {
    *getWebNewsListPage({ payload }, { call, put }) {
      const response =  yield call(webNewsListPage, payload);

      if (response && response.code === '1'){
        yield put({
          type: 'setNewsList',
          payload: response.resMap.page
        });
      }
    },

    *getWebQueryNewsById({ payload }, { call, put }) {
      const response =  yield call(webQueryNewsById, payload);

      if (response && response.code === '1'){
        yield put({
          type: 'setNewsDetail',
          payload: response.resMap.wbVo
        });
      }
    }

  },

  reducers: {
    setNewsList(state, { payload }){
      return {
        ...state,
        newsList: payload.result,
        listTotal: payload.totalCount
      };
    },
    setNewsDetail(state, { payload }){
      return {
        ...state,
        newDetail: payload,
      };
    }
  },
};

export default Model;


