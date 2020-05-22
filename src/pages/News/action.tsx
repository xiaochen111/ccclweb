import React, { Component } from 'react';
import { Dispatch, AnyAction } from 'redux';
import PageWrapper from '@/components/PageWrapper';
import PageLoading from '@/components/PageLoading';
import { Breadcrumb } from 'antd';
import { StateType } from '@/models/news';
import { connect } from 'dva';
import styles from './index.scss';
import { Link } from 'umi';

interface IProps extends StateType  {
  dispatch: Dispatch<AnyAction>;
  match?: any;
}



@connect(({ news }) => ({
  newDetail: news.newDetail,
}))
export class NewsDetail extends Component<IProps, any> {
  state = {
    id: this.props.match.params && this.props.match.params.id,
  }

  componentDidMount(){
    this.initPage();
  }

  initPage = () => {
    const { dispatch } = this.props;
    const { id } = this.state;

    dispatch({
      type: 'news/getWebQueryNewsById',
      payload: { id }
    });
  }

  render() {
    const { newDetail } = this.props;

    if (!newDetail){
      return <PageLoading/>;
    }
    return (
      <PageWrapper wrapperClassName={styles.newMainBox}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/news">新闻列表</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            新闻详情
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className={styles.newsMain}>
          <p className={styles.title}>{newDetail.title}</p>
          <p className={styles.time}>{newDetail.strNewsDate}</p>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: newDetail.content }}/>
        </div>

      </PageWrapper>
    );
  }
}

export default NewsDetail;
