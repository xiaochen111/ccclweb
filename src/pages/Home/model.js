export default {
  namespace: 'home',

  state: {
    title: '11',
  },

  reducers: {
    changeTitle(state, { payload }) {
      return {
        ...state,
        title: payload
      }
    }
  }
}