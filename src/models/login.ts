import { Reducer } from 'redux';
import { Effect } from 'dva';
import { stringify } from 'querystring';
import { router } from 'umi';

import { getPageQuery } from '@/utils/utils';

import { asyncRequest } from '@/utils/request';
import upms from '@/api/upms';

export interface StateType {
  code?: number;
  message?: string;
  status?: 'ok' | 'error';
  type?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(asyncRequest, upms.api_upms_login, payload);
      const obj = { status: 'ok', code: response.code, type: 'account', message: response.message };
      if (response.code !== 0) {
        obj.status = 'error';
      }
      yield put({
        type: 'changeLoginStatus',
        payload: obj,
      });
      // Login successfully
      if (obj.status === 'ok') {
        localStorage.setItem('authorizotion', response.result);
        // 获取重定向URL
        const redirectResponse = yield call(asyncRequest, upms.api_upms_login_redirect_url);
        if (redirectResponse.code === 0) {
          window.location.href = redirectResponse.result;
          return;
        }

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      localStorage.removeItem('authorizotion');

      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        code: payload.code,
        status: payload.status,
        type: payload.type,
        message: payload.message,
      };
    },
  },
};

export default Model;
