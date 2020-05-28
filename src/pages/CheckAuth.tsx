import React from 'react';
// import { message } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import { GetPageQuery } from '@/utils/utils';
import PageLoading from '@/components/PageLoading';

class CheckAuth extends React.PureComponent<any, any> {
  componentDidMount() {
    const { dispatch } = this.props;
    const pageQuery = GetPageQuery();
    const { uuid, backUrl } = pageQuery;

    dispatch({
      type: 'global/uuidLogin',
      payload: { uuid },
    }).then(result => {
      console.log('CheckAuth -> componentDidMount -> result', result);
      if (result) {
        router.replace('/home');
      }
    });

  }
  render() {
    return <PageLoading/>;
  }
}

export default connect()(CheckAuth);
