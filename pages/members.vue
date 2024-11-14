<template>
  <section class="unit-list">
    <h1>중대별 명단 / 총원 : {{ totalCount }}명</h1>
    <div class="unit-container">
      <!-- 각 대대 이름을 수평으로 나열 -->
      <div v-for="(count, unit) in unitCounts" :key="unit" class="unit">
        <h2>{{ unit }} ({{ count }}명)</h2>
        <div class="member-list">
          <!-- 대대에 속하는 부대원들을 두 열로 표시 -->
          <div
            v-for="member in filteredMembersByUnit(unit)"
            :key="member.id"
            class="member"
          >
            {{ member.rank }} {{ member.name }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      members: [],
      unitCounts: {},
      totalCount: 0,
    }
  },
  middleware: 'auth',

  async mounted() {
    const response = await axios.get('http://localhost:3000/api/v1.0/members')
    this.members = response.data.member
    this.unitCounts = response.data.unitCounts // 대대별 인원수 데이터
    this.totalCount = response.data.totalCount
  },
  methods: {
    filteredMembersByUnit(unit) {
      return this.members.filter((member) => member.unit === unit)
    },
  },
}
</script>
<style scoped>
.unit-list {
  background-color: #e0f7fa; /* 페이지 배경색 */
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #00796b; /* 제목 색상 */
}

.unit-container {
  display: flex;
  flex-wrap: wrap; /* 여러 줄로 배치되도록 설정 */
  gap: 20px;
  justify-content: center; /* 가운데 정렬 */
}

.unit {
  display: flex;
  flex-direction: column;
  flex: 1 1 30%; /* 각 대대가 3등분되도록 설정, 화면 크기에 따라 자동으로 비율 조정 */
  border: 1px solid #00796b;
  padding: 20px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
  min-width: 250px; /* 최소 너비 설정 */
  max-width: 350px; /* 최대 너비 설정 */
  text-align: center;
  transition: transform 0.3s ease-in-out; /* 호버 시 부드러운 확대 효과 */
}

.unit:hover {
  transform: scale(1.05); /* 호버 시 확대 */
}

.unit h2 {
  font-size: 1.2em;
  margin: 10px 0;
  font-weight: bold;
  color: #00796b;
}

.member-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 두 열로 부대원 배치 */
  gap: 10px;
  width: 100%;
}

.member {
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 8px;
  font-size: 1em;
  color: #333;
  text-align: center;
  min-width: 120px; /* 최소 너비 설정 */
  max-width: 150px; /* 최대 너비 설정 */
  width: fit-content; /* 내용에 맞게 너비 조정 */
  white-space: nowrap; /* 이름이 길어도 줄바꿈하지 않음 */
  overflow: hidden; /* 이름이 길면 잘림 */
  text-overflow: ellipsis; /* 이름이 길면 "..."으로 표시 */
  transition: background-color 0.3s ease-in-out; /* 호버 시 색상 변경 */
}

.member:hover {
  background-color: #00796b; /* 호버 시 배경색 변경 */
  color: white; /* 호버 시 텍스트 색상 변경 */
}
</style>
