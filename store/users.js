export const state = () => ({
  isAuthenticated: false,
})

export const mutations = {
  login(state) {
    state.isAuthenticated = true // 로그인 성공 시 상태 변경
  },
  logout(state) {
    state.isAuthenticated = false // 로그아웃 시 상태 초기화
  },
}
