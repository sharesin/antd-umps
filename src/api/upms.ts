/**
 * UPMS模块API定义
 */
const upms = {
  // 获取验证码开启状态接口
  api_upms_captcha_status: '/api/upms/captcha/status',
  // 获取图片验证码接口
  api_upms_captcha: '/api/upms/captcha',
  // 登录接口
  api_upms_login: '/api/upms/login',

  // 获取重定向URL
  api_upms_login_redirect_url: '/api/upms/sys-permission/redirect',
  // 获取当前用户信息
  api_upms_current_user: '/api/upms/sys-user/currentUser',
  // 获取用户菜单接口
  api_upms_sys_permission_menus: '/api/upms/sys-permission/menus',

  /**
   * 系统用户模块
   */
  api_upms_sys_user_save: '/api/upms/sys-user/save',
  api_upms_sys_user_remove: '/api/upms/sys-user/remove',
  api_upms_sys_user_edit: '/api/upms/sys-user/edit',
  api_upms_sys_user_edit_batch: '/api/upms/sys-user/edit/batch',
  api_upms_sys_user_list: '/api/upms/sys-user/list',
  api_upms_sys_user_detail: '/api/upms/sys-user/detail',

  /**
   * 系统角色模块
   */
  api_upms_sys_role_save: '/api/upms/sys-role/save',
  api_upms_sys_role_remove: '/api/upms/sys-role/remove',
  api_upms_sys_role_edit: '/api/upms/sys-role/edit',
  api_upms_sys_role_edit_batch: '/api/upms/sys-role/edit/batch',
  api_upms_sys_role_list: '/api/upms/sys-role/list',
  api_upms_sys_role_detail: '/api/upms/sys-role/detail',
  api_upms_sys_role_permission_assignment: '/api/upms/sys-role/permission/assignment',
  api_upms_sys_role_menus_permissions: '/api/upms/sys-role/menusAndPermissions',

  /**
   * 系统菜单模块
   */
  api_upms_sys_menu_save: '/api/upms/sys-permission/save',
  api_upms_sys_menu_remove: '/api/upms/sys-permission/remove',
  api_upms_sys_menu_edit: '/api/upms/sys-permission/edit',
  api_upms_sys_menu_edit_batch: '/api/upms/sys-permission/edit/batch',
  api_upms_sys_menu_list: '/api/upms/sys-permission/list',
  api_upms_sys_menu_detail: '/api/upms/sys-permission/detail',
};
export default upms;
