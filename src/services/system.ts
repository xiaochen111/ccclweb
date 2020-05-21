import request from '@/utils/request';

/**
 * 更改个人信息
 * @param params
 */
export async function updateWebUserInfo(params) {
  return request('/api/web/webuser/update_web_user_info.do', {
    method: 'POST',
    data: params,
  });
}
/**
 * 更改个人信息
 * @param params
 */
export async function updateUserPwd(params) {
  return request('/api/web/webuser/update_user_pwd.do', {
    method: 'POST',
    data: params,
  });
}
