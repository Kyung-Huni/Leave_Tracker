<template>
  <section class="signin">
    <div class="container">
      <p v-if="message">{{ message }}</p>

      <form @submit.prevent="login">
        <label for="uid">아이디</label>
        <input type="text" id="uid" v-model="uid" />
        <label for="password">패스워드</label>
        <input type="password" id="password" v-model="password" />
        <button type="submit">로그인</button>
      </form>
    </div>
  </section>
</template>

<script>
const axios = require('axios')
export default {
  data() {
    return {
      uid: '',
      password: '',
      message: this.$route.query.message || '',
    }
  },

  methods: {
    async login() {
      const url = 'http://localhost:3000/api/v1.0/auth/login'
      try {
        const response = await axios.post(url, {
          uid: this.uid,
          password: this.password,
        })

        if (response.status == 200) {
          this.$store.commit('setAuthentication', true)

          const redirectPath = this.$route.query.redirect || '/'
          this.$nuxt.$router.replace(redirectPath)
        } else if (data.status == 204) {
          alert('잘못된 정보입니다.')
        }
      } catch (error) {
        console.error('로그인 실패:', error)
        alert('로그인 중 오류가 발생했습니다.')
      }
    },
  },
}
</script>
