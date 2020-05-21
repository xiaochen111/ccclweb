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
    const { loginUuid, backUrl } = pageQuery;

    dispatch({
      type: 'global/uuidLogin',
      payload: { uuid: loginUuid },
    }).then(result => {
      if (result) {
        router.replace(backUrl);
      }
    });

  }
  render() {
    return <PageLoading/>;
  }
}

export default connect()(CheckAuth);
