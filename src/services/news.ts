import request from '@/utils/request';

/**
 * 获取网站登录用户信息
 *
 * @export
 * @returns
 */
export async function webNewsListPage(data = {}) {
  return request('/api/web/webnews/webNewsListPage.do', {
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
  return request('/api/web/webnews/webQueryNewsById.do', {
    method: 'POST',
    data
  });
}