import React from 'react';
import { Redirect } from 'umi';
import { GetGlobalToken } from '@/utils/cache';
import { GetPageQuery } from '@/utils/utils';
import { stringify } from 'qs';

export default (props) => {
  const { location: { pathname }, children } = props;

  const token = GetGlobalToken();
  const pageQuery = GetPageQuery();
  const loginRoute = ['/control', '/door/place-order'];

  if (pageQuery && pageQuery.uuid) {
    return <Redirect to={{
      pathname: '/check-auth',
      search: stringify({
        loginUuid: pageQuery.uuid,
        backUrl: pathname
      })
    }} />;
  }

  if (loginRoute.includes(pathname)) {
    if (token) {
      return children;
    }
    return <Redirect to="/login" />;
  }

  return children;
};
