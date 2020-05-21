import request from '@/utils/request';

/**
 * 获取网站登录用户信息
 *
 * @export
 * @returns
 */
export async function queryUserBaseInfomation() {
  return request('/api/web/webuser/webuser_info.do', {
    method: 'POST',
  });
}

/**
 * 使用uuid登录
 *
 * @export
 * @returns
 */
export async function sendUuidLogin(data = {}) {
  return request('/api/web/webuser/auto_login.do', {
    method: 'POST',
    data,
  });
}

/**
 * 国家下拉框
 * @param data
 */
export async function queryCountryDropList(data = {}) {
  return request('/api/web/lcl/country_drop.do', {
    method: 'POST',
    data,
  });
}

/**
 * 包装类型列表
 * @param data
 */
export async function queryGlobalPackageTypeList(data = {}) {
  return request('/api/web/lcl/packageType.do', {
    method: 'POST',
    data,
  });
}

/**
 * 获取特价
 * @param data
 */
export async function bargainPrice(data = {}) {
  return request('/api/web/lcl/special_list.do', {
    method: 'POST',
    data,
  });
}
