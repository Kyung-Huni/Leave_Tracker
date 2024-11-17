// store/index.js
export const state = () => ({
  isAuthenticated: false,
})

export const mutations = {
  setAuthentication(state, status) {
    state.isAuthenticated = status
  },
}

export const actions = {
  async checkSession({ commit }) {
    try {
      const response = await this.$axios.get(
        'https://leave-tracker-7jkh.onrender.com/api/auth/session-check',
        {
          withCredentials: true,
        }
      )
      commit('setAuthentication', response.data.isAuthenticated)
    } catch (error) {
      commit('setAuthentication', false)
    }
  },
}
