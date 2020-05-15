import request from '@/utils/request';

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

/**
 * 用户登录
 * @param params
 */
export async function doLogin(params) {
  return request('/api/web/webuser/login.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 手机注册发送短信验证码
 * @param params
 */
export async function sendRegistPhoneMsg(params) {
  return request('/api/web/veriy_code/send_regist_msg.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 手机注册
 * @param params
 */
export async function registerPhone(params) {
  console.log('registerPhone -> params', params);
  return request('/api/web/webuser/register.do', {
    method: 'POST',
    data: params,
  });
}
