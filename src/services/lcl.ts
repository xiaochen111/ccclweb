import request from '@/utils/request';

/**
 * 拼箱运价列表
 * @param data
 */
export async function queryLclList(data = {}) {
  return request('/web/lcl/list.do', {
    method: 'POST',
    data,
  });
}

/**
 * 拼箱订单详情
 *
 * @export
 * @param {*} data
 * @returns
 */
export async function queryLclDetail(data) {
  return request('/web/lcl/orderInfo.do', {
    method: 'POST',
    data,
  });
}

/**
 * 拼箱提交委托
 *
 * @export
 * @param {*} data
 * @returns
 */
export async function doOrderSubmit(data) {
  return request('/web/lcl/order/orderSubmit.do', {
    method: 'POST',
    data,
  });
}


/**
 * 计算总金额参考价
 *
 * @export
 * @param {*} data
 * @returns
 */
export async function queryLclTotalPrice(data) {
  return request('/web/lcl/getTotalPrice.do', {
    method: 'POST',
    data,
  });
}