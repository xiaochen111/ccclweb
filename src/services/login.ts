import request from '@/utils/request';

/**
 * 获取验证码图片
 *
 * @export
 * @param {*} params
 * @returns
 */
export async function queryCaptchImage() {
  return request('/web/veriy_code/get_img.do', {
    method: 'POST',
  });
}

/**
 * 用户登录
 * @param params
 */
export async function doLogin(params) {
  return request('/web/webuser/login.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 手机注册发送短信验证码
 * @param params
 */
export async function sendRegistPhoneMsg(params) {
  return request('/web/veriy_code/send_regist_msg.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 发送邮箱验证码
 * @param params
 */
export async function sendRegistEmailMsg(params) {
  return request('/web/veriy_code/send_regist_email.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 注册
 * @param params
 */
export async function doRegister(params) {
  return request('/web/webuser/register.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 找回密码
 * @param params
 */
export async function doResetPassword(params) {
  return request('/web/webuser/reset_password.do', {
    method: 'POST',
    data: params,
  });
}

/**
 * 忘记密码发送短信验证码
 * @param params
 */
export async function doPhoneSendRepasswordMsg(params) {
  return request('/web/veriy_code/send_repassword_msg.do', {
    method: 'POST',
    data: params,
  });
}

//
/**
 * 忘记密码发送短信验证码
 * @param params
 */
export async function doSendRepasswordEmail(params) {
  return request('/web/veriy_code/send_repassword_email.do', {
    method: 'POST',
    data: params,
  });
}
