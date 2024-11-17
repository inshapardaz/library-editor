import { isJsonString } from "/src/util";
import Cookies from 'js-cookie';

export const getUser = () => {
  const userCookie = Cookies.get('user');
  if (userCookie && isJsonString(userCookie)) {
    return JSON.parse(userCookie);
  }

  return null;
};

export const setUser = (user) => {
  Cookies.set('user', JSON.stringify(user));
};

export const clearUser = () => {
  Cookies.remove('user');
};
