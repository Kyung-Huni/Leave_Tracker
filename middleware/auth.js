// middleware/auth.js
export default function ({ store, redirect, route }) {
  // 로그인이 되어 있지 않으면 로그인 페이지로 리다이렉트
  if (!store.state.isAuthenticated) {
    return redirect(
      `/login?message=${encodeURIComponent(
        '로그인이 필요합니다.'
      )}&redirect=${encodeURIComponent(route.path)}`
    )
  }
}
