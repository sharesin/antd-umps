import { Effect } from 'dva';
import { Reducer } from 'redux';

import { query as queryUsers } from '@/services/user';

import { asyncRequest } from '@/utils/request';
import upms from '@/api/upms';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface UserModelState {
  menus: [];
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchMenus: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveMenus: Reducer<UserModelState>;
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchMenus(_, { call, put }) {
      const response = yield call(asyncRequest, upms.api_upms_sys_permission_menus);
      if (response && response.result) {
        yield put({
          type: 'saveMenus',
          payload: response.result,
        });
      }
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(asyncRequest, upms.api_upms_current_user);
      if (response.code === 0) {
        const user = response.result;
        window.currentUser = user;
        // 校验当前url是否为根路径，如是根路径获取首页URL接口
        if (window.location.pathname === '/') {
          // 获取重定向URL
          const redirectResponse = yield call(asyncRequest, upms.api_upms_login_redirect_url);
          if (redirectResponse.code === 0) {
            window.location.href = redirectResponse.result;
            return;
          }
          return;
        }

        yield put({
          type: 'saveCurrentUser',
          payload: {
            userid: user.userId,
            name: user.loginId,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          },
        });
      }
    },
  },

  reducers: {
    saveMenus(state, { payload }) {
      return {
        ...state,
        menus: payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
