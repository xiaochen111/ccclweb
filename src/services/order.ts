import request from '@/utils/request';

/**
 * 获取我的订单列表
 * @param data
 */
export async function queryOrderList(data = {}) {
  return request('/api/web/lcl/order/list.do', {
    method: 'POST',
    data,
  });
}
