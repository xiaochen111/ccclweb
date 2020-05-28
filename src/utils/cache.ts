import {
  SetLocalStorage,
  GetLocalStorage,
  RemoveLocalStorage,
  RemoveAllLocalStorage,
} from './storage/local';
import {
  SetSessionStorage,
  GetSessionStorage,
  RemoveSessionStorage,
  RemoveAllSessionStorage,
} from './storage/session';

// 网站标识
export const SetGlobalFlag = (token: string) => SetLocalStorage('webGlobalFlag', token);
export const GetGlobalFlag = () => GetLocalStorage('webGlobalFlag');
export const RemoveGlobalFlag = () => RemoveSessionStorage('webGlobalFlag');

// 用户token
export const SetGlobalToken = (flag, token: string) => SetLocalStorage(flag, token);
export const GetGlobalToken = (flag) => GetLocalStorage(flag);
export const RemoveGlobalToken = (flag) => RemoveLocalStorage(flag);

// 用户登录信息
export const SetAccountInfo = (info: any) => SetLocalStorage('webAccountInfo', info);
export const GetAccountInfo = () => GetLocalStorage('webAccountInfo');
export const RemoveAccountInfo = () => RemoveLocalStorage('webAccountInfo');

// 清空所有storage
export const RemoveAllStorage = () => {
  // RemoveAllLocalStorage();
  // RemoveAllSessionStorage();
  RemoveGlobalFlag();
  RemoveGlobalToken(GetGlobalFlag());
  RemoveAccountInfo();
};
