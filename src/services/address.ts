import request from '@/utils/request';

/**
 * 获取目的地送货地址
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function contactAddress(params = {}) {
  return request('/api/web/lcl/contact/contactAddressByPage.do', {
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

/**
 * 修改
 * @param params
 */

export async function updateContactAddress(params = {}) {
  return request('/api/web/lcl/contact/updateContactAddress.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 设置默认
 * @param params
 */

export async function setContactDefaultAddress(params = {}) {
  return request('/api/web/lcl/contact/setContactDefaultAddress.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 取消默认
 * @param params
 */
export async function cancelContactDefaultAddress(params = {}) {
  return request('/api/web/lcl/contact/cancelContactDefaultAddress.do', {
    method: 'POST',
    data: params,
  });
}
