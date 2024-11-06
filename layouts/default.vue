<template>
  <div>
    <Header></Header>
    <nuxt />
    <div v-if="alertMessage" class="alert">{{ alertMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alertMessage: null,
    }
  },
  mounted() {
    this.$root.$on('showAlert', (message) => {
      this.alertMessage = message
      setTimeout(() => {
        this.alertMessage = null // 일정 시간 후에 메시지 사라짐
      }, 3000) // 3초 후에 메시지 사라짐
    })
  },
  beforeDestroy() {
    this.$root.$off('showAlert') // 이벤트 리스너 정리
  },
}
</script>

<style>
.alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: red;
  color: white;
  padding: 10px;
  border-radius: 5px;
}
</style>
