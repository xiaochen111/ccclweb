import React from 'react';
import { message } from 'antd';
import { Redirect } from 'umi';
import { GetGlobalToken } from '@/utils/cache';

export default props => {
  const {
    location: { pathname },
  } = props;
  let token = GetGlobalToken();

  if (['/login', '/door/'].includes(pathname)) {
    if (token) {
      return props.children;
    } else {
      return <Redirect to="/home" />;
    }
  } else {
    return props.children;
  }
};
