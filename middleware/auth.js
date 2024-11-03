// middleware/auth.js
module.exports = function ({ store, redirect, route }) {
  if (!store.state.users.isAuthenticated) {
    return redirect('/signin')
  }
  if (store.state.users.isAuthenticated && route.path === '/signin') {
    return redirect('/') // 이미 인증된 사용자가 로그인 페이지에 접근할 경우 홈으로 리다이렉션
  }
}
