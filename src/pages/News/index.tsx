import React, { Component } from 'react';
import { Carousel, Input, Pagination } from 'antd';
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
}

interface Istate {
  pageNo: number;
  pageSize: number;
  title:string;
}


@connect(({ news }) => ({
  newsList: news.newsList,
  listTotal: news.listTotal,
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

  handleTabelChange = pagination => {
    this.setState(
      {
        pageNo: pagination,
      },
      this.handleSearchList,
    );
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
    const { listTotal, newsList } = this.props;

    const { pageNo, pageSize } =  this.state;
    const pagination = {
      total: listTotal,
      current: pageNo,
      pageSize,
    };


    return (
      <div>
        <PageWrapper>
          <Carousel>
            <div className={styles.banner}>
                11
            </div>
            <div className={styles.banner}>
              33
            </div>
          </Carousel>

          <div className={styles.main}>
            <Search placeholder="请输入搜索关键词" size="large" onSearch={value => { this.setTitleSearch(value); }} enterButton />
          </div>

          <div className={styles.newsMain}>
            {newsList && newsList.map(item => (
              <div className={styles.newItem} key={item.iD} onClick={() => { this.toDetail(item.iD); }}>
                <img src={newsImg} alt=""/>
                <div className={styles.newRight}>
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.date}>{item.strNewsDate}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.paginationContainer}>
            <span className={styles.total}>
                共<strong>{listTotal}</strong>条
            </span>
            <Pagination onChange={this.handleTabelChange} {...pagination} showQuickJumper showSizeChanger />
          </div>
        </PageWrapper>
      </div>
    );
  }
}

export default News;
