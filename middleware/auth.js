// middleware/auth.js
export default async function ({ store, redirect, route }) {
  await store.dispatch('checkSession')

  if (store.state.isAuthenticated && route.path === '/login') {
    return redirect('/') // 예시로 홈으로 리다이렉트
  }

  // 로그인이 되어 있지 않으면 로그인 페이지로 리다이렉트
  if (!store.state.isAuthenticated) {
    return redirect(
      `/login?message=${encodeURIComponent(
        '로그인이 필요합니다.'
      )}&redirect=${encodeURIComponent(route.path)}`
    )
  }
}
