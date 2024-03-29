import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export const state = () => ({
  userData: null,
});

export const mutations = {
  findUserData(state) {
    var token = Cookies.get("access_token_st");
    if (token) {
      jwt.verify(token, "systemuser_st", function (error, decoded) {
        if (error == null) state.userData = decoded;
      });
    } else {
      state.userData = null;
    }
    // state.userData = JSON.parse(localStorage.getItem("systemuser_st"));
  },
};
export const actions = {};
export const getters = {
  userData: (state) => {
    return state.userData;
  },
};
