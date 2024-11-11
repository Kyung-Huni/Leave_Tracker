<template>
  <div>
    <nuxt-link to="/">메인 페이지</nuxt-link>
    <nuxt-link to="/addinfo" v-if="isAuthenticated">보고내용 추가</nuxt-link>
    <nuxt-link to="/calendar" v-if="isAuthenticated">달력 페이지</nuxt-link>
    <nuxt-link to="/today" v-if="isAuthenticated">금일 인원 파악</nuxt-link>
    <nuxt-link to="/members" v-if="isAuthenticated">부대원 목록</nuxt-link>
    <nuxt-link to="/registry" v-if="isAuthenticated">부대원 추가</nuxt-link>
    <nuxt-link to="/login" v-if="!isAuthenticated">로그인</nuxt-link>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated
    },
  },

  async mounted() {
    await this.$store.dispatch('checkSession')
  },
}
</script>
