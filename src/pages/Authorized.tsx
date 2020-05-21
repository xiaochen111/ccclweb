import React from 'react';
// import { message } from 'antd';
import { connect } from 'dva';
import { Redirect } from 'umi';
import { GetGlobalToken } from '@/utils/cache';
// import { GetPageQuery } from '@/utils/utils';

const Authorized = props => {
  // const { dispatch } = props;
  const token = GetGlobalToken();
  // const params = GetPageQuery();

  // if (params && params.uuid) {
  //   dispatch({
  //     type: 'global/uuidLogin',
  //     payload: { uuid: params.uuid },
  //   });

  //   return null
  // }

  if (token) {
    return props.children;
  } else {
    // message.info('请先登录');
    return <Redirect to="/login" />;
  }
};

export default connect()(Authorized);
