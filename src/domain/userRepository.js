import { isJsonString } from "/src/util";
import Cookies from 'js-cookie';
import { COOKIE_DOMAIN } from "/src/config";

export const getUser = () => {
  const userCookie = Cookies.get('user');
  if (userCookie && isJsonString(userCookie)) {
    return JSON.parse(userCookie);
  }

  return null;
};

export const setUser = (user) => {
  Cookies.set('user', JSON.stringify(user), { path: '/', domain: COOKIE_DOMAIN, secure: true });
};

export const clearUser = () => {
  Cookies.remove('user');
};
