<template>
  <div>
    <nuxt-link to="/">메인 페이지</nuxt-link>
    <nuxt-link to="/addinfo" v-if="isAuthenticated">보고내용 추가</nuxt-link>
    <nuxt-link to="/calendar" v-if="isAuthenticated">달력 페이지</nuxt-link>
    <nuxt-link to="/today" v-if="isAuthenticated">금일 현재원 파악</nuxt-link>
    <nuxt-link to="/members" v-if="isAuthenticated">부대원 목록</nuxt-link>
    <nuxt-link to="/registry" v-if="isAuthenticated">부대원 추가</nuxt-link>
    <nuxt-link to="/users" v-if="isAuthenticated">관리자 목록</nuxt-link>
    <nuxt-link to="/signin" v-if="!isAuthenticated">로그인</nuxt-link>
  </div>
</template>

<script>
const axios = require('axios')

export default {
  computed: {
    isAuthenticated: {
      get() {
        return this.$store.state.users.isAuthenticated
      },
      set(value) {
        this.$store.commit('users/setAuthenticated', value)
      },
    },
  },

  async mounted() {
    const url = 'http://localhost:3000/api/v1.0/users/session-check'
    var data = await axios.get(url)

    if (data.data) {
      this.isAuthenticated = true
    } else {
      this.isAuthenticated = false
    }
  },
}
</script>
