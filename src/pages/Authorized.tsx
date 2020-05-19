import React from 'react';
import { message } from 'antd';
import { Redirect } from 'umi';
import { GetGlobalToken } from '@/utils/cache';

export default props => {
  // console.log(props);
  let token = GetGlobalToken();
  if (token) {
    return props.children;
  } else {
    // message.info('请先登录');
    return <Redirect to="/login" />;
  }
};
