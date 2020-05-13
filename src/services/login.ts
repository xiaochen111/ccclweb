import request from '@/utills/request';

/**
 * 获取验证码图片
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function queryCaptchImage() {
  return request('/api/web/veriy_code/get_img.do', {
    method: 'POST',
  });
}
