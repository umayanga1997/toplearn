export const state = () => ({
  total_of_marks: 0,
  question_count: 0,
});
export const mutations = {
  cal_marks(state, payload) {
    if (payload[1]) state.total_of_marks += payload[0];
    state.question_count += 1;
  },
  clearMarks(state) {
    state.total_of_marks = 0;
    state.question_count = 0;
  },
};

export const getters = {
  total_of_marks: (state) => {
    return state.total_of_marks;
  },
  question_count: (state) => {
    return state.question_count;
  },
};
