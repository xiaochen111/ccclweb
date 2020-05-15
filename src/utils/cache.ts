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

// 用户token
export const SetGlobalToken = (token: string) => SetLocalStorage('globalToken', token);
export const GetGlobalToken = () => GetLocalStorage('globalToken');
export const RemoveGlobalToken = () => RemoveSessionStorage('globalToken');

// 用户登录信息
export const SetAccountInfo = (info: any) => SetLocalStorage('accountInfo', info);
export const GetAccountInfo = () => GetLocalStorage('accountInfo');
export const RemoveAccountInfo = () => RemoveSessionStorage('accountInfo');

// 清空所有storage
export const RemoveAllStorage = () => {
  RemoveAllLocalStorage();
  RemoveAllSessionStorage();
};
