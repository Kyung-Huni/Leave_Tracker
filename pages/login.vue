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

      <div v-if="loginError" class="error">{{ loginError }}</div>
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
      loginError: this.$route.query.loginError || '',
    }
  },

  methods: {
    async login() {
      const url = 'https://leave-tracker-7jkh.onrender.com/api/auth/login'
      try {
        const response = await axios.post(url, {
          uid: this.uid,
          password: this.password,
          withCredentials: true,
        })

        if (response.status == 200) {
          this.$store.commit('setAuthentication', true)
          console.log('Login 성공!')

          const redirectPath = this.$route.query.redirect || '/'
          this.$nuxt.$router
            .push({
              path: redirectPath,
            })
            .catch(() => {})
        } else if (response.status == 204) {
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

<style scoped>
/* 로그인 페이지 배경 */
.signin {
  background: linear-gradient(
    to right,
    #a2c2e8,
    #f0f4f7
  ); /* 연한 파란색에서 밝은 회색 그라데이션 */
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
/* 로그인 폼 컨테이너 */
.container {
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; /* 폼 최대 너비 */
  text-align: center;
}

/* 메시지 및 에러 텍스트 */
p,
.error {
  font-size: 1rem;
  color: #ff4d4f;
  margin-bottom: 15px;
}

/* 입력 필드 스타일 */
label {
  display: block;
  font-size: 1rem;
  color: #333;
  margin: 10px 0 5px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
  box-sizing: border-box;
  background-color: #fafafa;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #2575fc; /* 파란색 테두리 */
}

/* 로그인 버튼 스타일 */
button {
  width: 100%;
  padding: 12px;
  background-color: #2575fc;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #6a11cb; /* 버튼 색상 변화 */
}

/* 오류 메시지 스타일 */
.error {
  background-color: #ffe6e6;
  padding: 10px;
  border-radius: 5px;
  color: #ff4d4f;
  margin-top: 15px;
}
</style>
