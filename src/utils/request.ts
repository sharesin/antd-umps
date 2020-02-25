/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, Modal } from 'antd';

import { router } from 'umi';
import { Md5 } from 'ts-md5';
import { getNonce } from '@/utils/utils';

const codeMessage = {
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

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
  responseType: 'json',
  parseResponse: true,
});

/**
 * AppInfo
 */
const appInfo = {
  APP_ID: 'admin_backend',
  APP_SECRET: 'cdc58e10167b11eaa38fe111b14750bc',
};

// 请求拦截
request.interceptors.request.use((url, options) => {
  const Nonce = getNonce();
  const Timestamp = new Date().getTime().toString();

  const nappId = appInfo.APP_ID;
  const token = Md5.hashStr(
    [appInfo.APP_ID, appInfo.APP_SECRET, Timestamp, Nonce].join(''),
  ).toString();
  const Sign = Md5.hashStr(
    [
      `app_id=${appInfo.APP_ID}`,
      `app_token=${token}`,
      `nonce=${Nonce}`,
      `timestamp=${Timestamp}`,
      `app_secret=${appInfo.APP_SECRET}`,
    ].join('&'),
  )
    .toString()
    .toUpperCase();

  // eslint-disable-next-line no-param-reassign
  options.headers = {
    Authorization: localStorage.getItem('authorizotion') || '',
    'APP-ID': nappId,
  };
  const para = options.data;
  // eslint-disable-next-line no-param-reassign
  options.data = {
    common: {
      appToken: token,
      appId: nappId,
      nonce: Nonce,
      timestamp: Timestamp,
      sign: Sign,
    },
    json: para,
  };
  //	console.log(options);
  return {
    url: `${url}?_t=${Timestamp}`,
    options: { ...options, interceptors: true },
  };
});

// 标识弹框
let modelShow = false;

// 响应拦截
request.interceptors.response.use(async response => {
  if (response.status !== 200) {
    return response;
  }
  const data = await response.clone().json();
  // 处理全局状态码
  // token过期
  if (data && data.code === 1000) {
    if (window.location.href.indexOf('/user/login') >= 0) {
      // message.error('登录失败！', 5);
    } else {
      router.push('/user/login');
    }
  } else if (data && data.code === 1060) {
    localStorage.removeItem('authorizotion');
    router.push('/user/login');
    if (!modelShow) {
      const modal = Modal.warning({
        title: '提示信息',
        content: '您的账号已在其他设备登录，请您重新登录！',
        okText: '知道了',
        onOk: () => {
          modelShow = false;
          modal.destroy();
        },
      });
    }
    modelShow = true;
  }
  return response;
});

export default request;

export async function asyncRequest(url: string, data?: any, method?: string) {
  return request(`/server${url}`, {
    method: method || 'POST',
    data,
  });
}
export function syncRequest(url: string, data?: any, method?: string) {
  return request(`/server${url}`, {
    method: method || 'POST',
    data,
  });
}
