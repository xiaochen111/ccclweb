import request from '@/utils/request';

/**
 * 国家下拉框
 * @param data
 */
export async function countryDrop(data = {}) {
  return request('/api/web/lcl/country_drop.do', {
    method: 'POST',
    data,
  });
}
