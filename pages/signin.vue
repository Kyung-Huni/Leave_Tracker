<template>
  <section class="signin">
    <div class="container">
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
    }
  },

  mounted() {
    if (this.$store.state.users.isAuthenticated) {
      this.$nuxt.$router.replace({ path: '/' }) // 이미 인증된 경우 홈으로 리다이렉션
    }
  },

  methods: {
    login() {
      this.$store.commit('users/login')
    },

    async signin() {
      const url = 'http://localhost:3000/api/v1.0/users/signin'
      try {
        const response = await axios.post(url, {
          uid: this.uid,
          password: this.password,
        })

        if (response.status === 200) {
          this.$store.commit('users/login', response.data.user) // 사용자 정보 전달
          this.$router.replace({ path: '/' })
        } else {
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
