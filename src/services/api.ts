import request from '@/utills/request';

/**
 * 上传图片
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function test() {
  return request('/api/web/veriy_code/get_img.do', {
    method: 'POST',
  });
}
