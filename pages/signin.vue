<template>
  <section class="signin">
    <div class="container">
      <h1 v-if="message">{{ message }}</h1>
      <form @submit.prevent="signin">
        <label for="아이디">아이디</label>
        <input type="text" v-model="uid" />
        <label for="패스워드">패스워드</label>
        <input type="password" v-model="password" />
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
      message: '',
    }
  },
  mounted() {
    this.message = this.$route.query.login || ''
  },
  methods: {
    login() {
      this.$store.commit('users/setAuthenticated', true)
    },

    async signin() {
      const url = 'http://localhost:3000/api/v1.0/users/signin'
      try {
        const response = await axios.post(url, {
          uid: this.uid,
          password: this.password,
        })

        if (response.status == 200) {
          this.login()
          this.$nuxt.$router.replace({ path: '/' })
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
