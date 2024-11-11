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
        'http://localhost:3000/api/v1.0/auth/session-check'
      )
      commit('setAuthentication', response.data.isAuthenticated)
    } catch (error) {
      console.error('API 요청 오류:', error)
      commit('setAuthentication', false)
    }
  },
}
