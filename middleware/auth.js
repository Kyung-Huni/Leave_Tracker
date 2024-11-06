// middleware/auth.js
module.exports = async function ({ store, redirect, route, app }) {
  try {
    const response = await $axios.get(
      'http://localhost:3000/api/v1.0/users/session-check'
    )
    if (response.data.isAuthenticated) {
      store.commit('SET_USER', response.data.user)
    } else {
      return redirect('/signin')
    }
  } catch (error) {
    console.error('Authentication check failed: ', error)
    return redirect('/signin')
  }

  if (store.state.users.isAuthenticated && route.path === '/signin') {
    return redirect('/') // 이미 인증된 사용자가 로그인 페이지에 접근할 경우 홈으로 리다이렉션
  }
}
