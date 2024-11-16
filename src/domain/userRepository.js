import { isJsonString } from "/src/util";

import Cookies from 'js-cookie';

const deleteAllCookies = () => {
  Cookies.remove('refreshToken');
  Cookies.remove('token');
}

export const getUser = () => {
  if (window.localStorage.user && isJsonString(window.localStorage.user)) {
    return JSON.parse(window.localStorage.user);
  }

  return null;
};

export const setUser = (user) => {
  return localStorage.setItem("user", JSON.stringify(user));
};

export const clearUser = () => {
  deleteAllCookies();

  return localStorage.removeItem("user");
};
