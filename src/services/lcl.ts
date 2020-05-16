import request from '@/utils/request';

/**
 * 拼箱运价列表
 * @param data
 */
export async function lclList(data = {}) {
  return request('/api/web/lcl/list.do', {
    method: 'POST',
    data,
  });
}
