import React from 'react';
import { message } from 'antd';
import { Redirect } from 'umi';
import { GetGlobalToken } from '@/utils/cache';

export default props => {
  console.log(props);
  const {
    location: { pathname },
  } = props;
  let token = GetGlobalToken();
  if (pathname.search(/login/) != -1) {
    if (token) {
      return <Redirect to="/home" />;
    } else {
      return props.children;
    }
  } else {
    return props.children;
  }
};
