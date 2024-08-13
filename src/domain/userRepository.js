import { isJsonString } from "/src/util";
import Cookies from "js-cookie";

var remove_sub_domain = function (v) {
    var is_co = v.match(/\.co\./);
    v = v.split(".");
    v = v.slice(is_co ? -3 : -2);
    v = v.join(".");
    return v;
};

var domain = remove_sub_domain(location.hostname);

export const getUser = () => {
    var userCookie = Cookies.get("user", { domain: domain });
    if (userCookie && isJsonString(userCookie)) {
        return JSON.parse(userCookie);
    }
    return null;
};

export const setUser = (user) => {
    Cookies.set("user", JSON.stringify(user), {
        domain: domain,
    });
};

export const clearUser = () => {
    Cookies.remove("user", { domain: domain });
};
