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
export const SetGlobalFlag = (token: string) => SetLocalStorage('globalFlag', token);
export const GetGlobalFlag = () => GetLocalStorage('globalFlag');
export const RemoveGlobalFlag = () => RemoveSessionStorage('globalFlag');

// 用户token
export const SetGlobalToken = (flag, token: string) => SetLocalStorage(flag, token);
export const GetGlobalToken = (flag) => GetLocalStorage(flag);
export const RemoveGlobalToken = (flag) => RemoveLocalStorage(flag);

// 用户登录信息
export const SetAccountInfo = (info: any) => SetLocalStorage('accountInfo', info);
export const GetAccountInfo = () => GetLocalStorage('accountInfo');
export const RemoveAccountInfo = () => RemoveLocalStorage('accountInfo');

// 清空所有storage
export const RemoveAllStorage = () => {
  RemoveAllLocalStorage();
  RemoveAllSessionStorage();
};
