export const state = () => ({
  bought_videos: [],
  bought_tests: [],
  // bought_live_classes: [],
  bought_tutes: [],
});

export const mutations = {
  setData(state, payload) {
    state.bought_videos = payload[0];
    state.bought_tests = payload[1];
    state.bought_tutes = payload[2];
  },
};
export const actions = {};
export const getters = {
  bought_videos: (state) => {
    return state.bought_videos;
  },
  bought_tests: (state) => {
    return state.bought_tests;
  },
  // bought_live_classes: (state) => {
  //   return state.bought_live_classes;
  // },
  bought_tutes: (state) => {
    return state.bought_tutes;
  },
};
