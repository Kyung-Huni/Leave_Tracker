<template>
  <header class="Header">
    <nav class="Header__nav">
      <div class="Header__logo">501st MI BDE RSO</div>

      <ul v-if="isAuthenticated" class="Header__menu">
        <li><nuxt-link to="/">메인 페이지</nuxt-link></li>
        <li><nuxt-link to="/addinfo">보고내용 추가</nuxt-link></li>
        <li><nuxt-link to="/calendar">달력 페이지</nuxt-link></li>
        <li><nuxt-link to="/today">금일 인원 파악</nuxt-link></li>
        <li><nuxt-link to="/members">부대원 목록</nuxt-link></li>
        <li><nuxt-link to="/registry">부대원 추가</nuxt-link></li>
      </ul>

      <div class="Header__auth">
        <button @click="handleAuth">
          {{ isAuthenticated ? 'Logout' : 'Login' }}
        </button>
      </div>
    </nav>
  </header>
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

  methods: {
    async handleAuth() {
      if (!this.$store.state.isAuthenticated) {
        this.$router.push('/login')
      } else {
        await this.$axios.get(
          'https://leave-tracker-y23h.onrender.com/api/auth/logout'
        )

        this.$store.commit('setAuthentication', false)

        this.$router.push('/')
      }
    },
  },
}
</script>

<style scoped>
.Header {
  width: 100%;
  background-color: #333;
  color: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.Header__nav {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.Header__logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.Header__menu {
  list-style: none;
  display: flex;
  gap: 20px;
}

.Header__menu li a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.Header__menu li a:hover {
  color: #ddd;
}

.Header__auth {
  display: flex;
  align-items: center;
}

.Header__auth button {
  background-color: #555;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.Header__auth button:hover {
  background-color: #777;
}
</style>
