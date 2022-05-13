export const state = () => ({
  trigger: false,
});

export const getters = {
  triggerValue: (state) => {
    return state.trigger;
  },
};
export const mutations = {
  trigger(state, payload) {
    state.trigger = payload;
  },
};
