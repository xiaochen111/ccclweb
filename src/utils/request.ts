/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import request, { extend } from 'umi-request';
import router from 'umi/router';
import { notification, message } from 'antd';
import { IsEmptyObject, ObjectToUrl } from './utils';
// import { GetGlobalToken, RemoveAllStorage } from './cache';

const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  console.log('error111', error);

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

request.interceptors.request.use((url, options: any) => {
  const token = null;
  const headers = Object.assign({}, token ? { token } : {});

  if (options.method.toUpperCase() === 'DELETE') {
    let params = IsEmptyObject(options.data)
      ? ''
      : ObjectToUrl({ params: JSON.stringify(options.data) });

    delete options.data;

    return {
      url: `${url}?${params}`,
      options: { ...options, headers },
    };
  }
  if (options.method.toUpperCase() === 'UPLOAD') {
    const formData = new FormData();
    formData.append('uploadPicture', options['body']);

    return {
      url,
      options: {
        method: 'POST',
        body: formData,
      },
    };
  }

  return { options: { ...options, headers } };
});

// 请求Status Code为200正常，但是返回值response code不为200情况
request.interceptors.response.use(async response => {
  const contentType = response.headers.get('Content-Type');

  if (contentType && contentType.match(/application\/json/i)) {
    const content = await response.clone().json();
    const { code, message: resMessage } = content;

    try {
      if (Number(code) !== 1) {
        switch (Number(code)) {
          case 401:
            // RemoveAllStorage();
            router.push('/login');

            throw resMessage;
          default:
            throw resMessage;
        }
      }
    } catch (errMsg) {
      message.error(errMsg);
    }
  }

  return response;
});
/**
 * 配置request请求时的默认参数
 */
export default extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  paramsSerializer: function(params) {
    return IsEmptyObject(params) ? '' : ObjectToUrl({ params: JSON.stringify(params) });
  },
});
