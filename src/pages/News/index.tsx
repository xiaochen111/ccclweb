import React, { Component } from 'react';
import { Carousel, Input, Pagination, Empty, Skeleton } from 'antd';
import { Dispatch, AnyAction } from 'redux';
import { StateType } from '@/models/news';
import { connect } from 'dva';
import PageWrapper from '@/components/PageWrapper';
import styles from './index.scss';
import { router } from 'umi';

const { Search } = Input;
const newsImg = require('../../assets/img/news.png');

interface Iprops extends StateType {
  dispatch: Dispatch<AnyAction>;
  newLoading:boolean
}

interface Istate {
  pageNo: number;
  pageSize: number;
  title:string;
}


@connect(({ news, loading }) => ({
  newsList: news.newsList,
  LimitList: news.LimitList,
  listTotal: news.listTotal,
  // newLoading: loading.global
  newLoading: loading.effects['news/getWebNewsListPage']
}))
export class News extends Component<Iprops, Istate> {

  state = {
    pageNo: 1,
    pageSize: 10,
    title: ''
  }

  componentDidMount(){
    console.log(this.props);

    this.handleSearchList();
    this.initLimit();
  }

  initLimit = () => {
    // getQueryLimit
    const { dispatch } = this.props;

    dispatch({
      type: 'news/getQueryLimit'
    });
  }

  handleSearchList = () => {
    const { dispatch } = this.props;
    const { pageNo, pageSize, title } = this.state;

    const params = { pageNo, pageSize, title };

    dispatch({
      type: 'news/getWebNewsListPage',
      payload: params
    });
  }

  handleTabelChange = current => {
    this.setState(
      {
        pageNo: current,
      },
      this.handleSearchList,
    );
  };

  handleTableSizeChange = (current, pageSize) => {
    this.setState({
      pageSize: pageSize,
    }, this.handleSearchList);
  };

  setTitleSearch = title => {
    this.setState(
      {
        title,
        pageNo: 1
      },
      this.handleSearchList,
    );
  }


  toDetail = id => {
    router.push({
      pathname: `/news/newDetail/${id}`
    });
  }

  render() {
    const { listTotal, newsList, LimitList, newLoading } = this.props;
    const { pageNo, pageSize } =  this.state;
    const pagination = {
      total: listTotal,
      current: pageNo,
      pageSize,
    };

    return (
      <PageWrapper>
        <Carousel autoplay>
          {LimitList && LimitList.map(item => (
            <div className={styles.banner} key={item.id} onClick={() => { this.toDetail(item.id); }}>
              <img src={item.picPath || newsImg} alt="" onError={(e) => { e.target['src'] = newsImg; }}/>
            </div>
          ))}
        </Carousel>

        <div className={styles.main}>
          <Search placeholder="请输入搜索关键词" size="large" onSearch={value => { this.setTitleSearch(value); }} enterButton />
        </div>

        <div className={styles.newsMain}>
          <Skeleton loading={newLoading} active avatar paragraph={{ rows: 4 }}>
            {
              newsList && newsList.length ? (newsList.map(item => (
                <div className={styles.newItem} key={item.id} onClick={() => { this.toDetail(item.id); }}>
                  <img src={item.picPath || newsImg} alt="" onError={(e) => { e.target['src'] = newsImg; }}/>
                  <div className={styles.newRight}>
                    <p className={styles.titleNews}>{item.title}</p>
                    <p className={styles.date}>{item.strNewsDate}</p>
                  </div>
                </div>
              ))) : (<Empty style={{ padding: 40 }} description="暂无数据" />)
            }
          </Skeleton>
        </div>

        {
          newsList && newsList.length ? <div className={styles.paginationContainer}>
            <span className={styles.total}>
                共<strong>{listTotal}</strong>条
            </span>
            <Pagination onChange={this.handleTabelChange}  onShowSizeChange={this.handleTableSizeChange} {...pagination} showQuickJumper showSizeChanger />
          </div> : ''
        }
      </PageWrapper>
    );
  }
}

export default News;
