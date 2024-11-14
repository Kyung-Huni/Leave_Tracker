<template>
  <section class="registry">
    <h1>Add Unit Members</h1>

    <div class="submit">
      <form @submit.prevent="registry">
        <label for="계급">계급</label>
        <select v-model="rank">
          <option
            v-for="cate in rankCategories"
            v-bind:value="cate"
            :key="cate"
          >
            {{ cate }}
          </option>
        </select>
        <label for="이름">이름</label>
        <input type="text" v-model="name" />
        <label for="소속">소속</label>
        <select v-model="unit">
          <option
            v-for="cate in unitCategories"
            v-bind:value="cate"
            :key="cate"
          >
            {{ cate }}
          </option>
        </select>
        <button type="submit">병사 추가하기</button>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      unitCategories: [
        '501 본부중대',
        '3정보 본부중대',
        '3정보 A/B',
        '3정보 찰리',
        '524정보대대',
      ],
      rankCategories: ['이병', '일병', '상병', '병장'],
      rank: '이병',
      name: '',
      unit: '',
    }
  },

  middleware: 'auth',

  methods: {
    async registry() {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1.0/members/registry',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rank: this.rank,
              name: this.name,
              unit: this.unit,
            }),
          }
        )

        if (response.ok) {
          const result = await response.json()
          alert('Successfully Added: ', result)
        } else {
          console.error('Adding Failed')
        }
      } catch (error) {
        console.error('Error: ', error)
      }
    },
  },
}
</script>

<style scoped>
.registry {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #e0f7fa; /* 배경색 */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5rem;
  color: #004d40;
  position: absolute; /* 제목을 절대 위치로 설정 */
  top: 250px; /* 화면 상단에서 여백 */
  left: 50%; /* 화면의 가로 중앙 */
  transform: translateX(-50%); /* 정확한 중앙 정렬 */
}

.submit {
  width: 100%;
  max-width: 500px; /* 최대 너비 설정 */
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 각 항목 사이의 간격 */
}

label {
  font-size: 1.1rem;
  color: #333;
}

select,
input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 100%;
}

button {
  padding: 10px;
  background-color: #00796b;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #004d40;
}
</style>
