<template>
  <div class="app-container">
    <Header></Header>
    <main><nuxt /></main>
  </div>
</template>

<script>
export default {
  layout: 'default',
}
</script>

<style scoped>
/* html과 body에 margin, padding을 0으로 설정 */
html,
body {
  height: 100%; /* 전체 화면 높이 설정 */
  width: 100%; /* 전체 화면 너비 설정 */
  margin: 0; /* 여백 제거 */
  padding: 0; /* 패딩 제거 */
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 화면 전체 높이 */
  min-width: 100vw;
}

Header {
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  padding-left: 0px;

  /* 헤더의 높이를 정해주어야 main 영역이 아래로 밀리지 않음 */
  height: 60px; /* 예시로 높이를 60px로 설정 */
  background-color: #333; /* 헤더 색상 */
}
</style>
