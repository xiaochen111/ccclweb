import request from '@/utils/request';

/**
 * 获取目的地送货地址
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function contactAddress(params = {}) {
  return request('/api/web/lcl/contact/contactAddress.do', {
    method: 'POST',
    data: params,
  });
}

//

/**
 * 新增目的地送货地址
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function saveContactAddress(params = {}) {
  return request('/api/web/lcl/contact/saveContactAddress.do', {
    method: 'POST',
    data: params,
  });
}
