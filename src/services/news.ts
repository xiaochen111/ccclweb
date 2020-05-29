import request from '@/utils/request';

/**
 * 获取网站登录用户信息
 *
 * @export
 * @returns
 */
export async function webNewsListPage(data = {}) {
  return request('/web/webnews/webNewsListPage.do', {
    method: 'POST',
    data
  });
}
/**
 * 获取新闻详情
 *
 * @export
 * @returns
 */
export async function webQueryNewsById(data = {}) {
  return request('/web/webnews/webQueryNewsById.do', {
    method: 'POST',
    data
  });
}
/**
 * 获取新闻推荐
 *
 * @export
 * @returns
 */
export async function queryLimit(data = {}) {
  return request('/web/webnews/queryLimit.do', {
    method: 'POST',
    data
  });
}