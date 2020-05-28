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

/**
 * 获取我的订单详情
 * @param data
 */
export async function queryOrderDetail(data = {}) {
  return request('/api/web/lcl/order/orderDetail.do', {
    method: 'POST',
    data,
  });
}

/**
 *
 * 获取订单费用明细
 * @export
 * @param {*} data
 * @returns
 */
export async function queryOrderFeeDetail(data) {
  return request('/api/web/lcl/order/orderPayfeeList.do', {
    method: 'POST',
    data,
  });
}

/**
 * 取消订单
 *
 * @export
 * @param {*} data
 * @returns
 */
export async function sendCancelOrder(data) {
  return request('/api/web/lcl/order/cancelOrder.do', {
    method: 'POST',
    data,
  });
}

/**
 * 订单费用确认
 *
 * @export
 * @param {*} data
 * @returns
 */
export async function sendOrderFeeConfirm(data) {
  return request('/api/web/lcl/order/confirmOrderFee.do', {
    method: 'POST',
    data,
  });
}

/**
 * 获取支付二维码
 *
 * @export
 * @param {*} data
 * @returns
 */
export async function queryPaymentOrCode(data) {
  return request('/api/web/lcl/order/getPaymentQRCode.do', {
    method: 'POST',
    data,
  });
}

/**
 * 同时获取支付二维码
 *
 * @export
 * @param {*} data
 * @returns
 */
export async function queryAllPaymentOrCode(data) {
  return request('/api/web/lcl/order/getPaymentQRCodeAll.do', {
    method: 'POST',
    data,
  });
}