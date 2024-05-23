import { isJsonString } from "/src/util";

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
  return localStorage.removeItem("user");
};
