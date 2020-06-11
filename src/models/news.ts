import { Effect } from 'dva';

import { webNewsListPage, webQueryNewsById, queryLimit } from '@/services/news';


export interface StateType {
  newsList: any[];
  LimitList: any[];
  newDetail:any;
  listTotal: number;
}

export interface NewsModelType {
  namespace: string;
  state: StateType;
  effects: {
    getWebNewsListPage: Effect;
    getWebQueryNewsById: Effect;
    getQueryLimit: Effect;
  };
  reducers: {};
}

const Model: NewsModelType = {
  namespace: 'news',
  state: {
    newsList: [],
    LimitList: [],
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
    },

    *getQueryLimit({ payload }, { call, put }) {
      const response =  yield call(queryLimit, payload);

      if (response && response.code === '1'){
        yield put({
          type: 'setLimitList',
          payload: response.resMap.webNewsVoList
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
    },
    setLimitList(state, { payload }){
      return {
        ...state,
        LimitList: payload,
      };
    }
  },
};

export default Model;


