<template>
  <section class="today">
    <div class="info-bo">
      <h1>Today's info</h1>
      <h2>{{ today }}</h2>
      <table>
        <tr>
          <th>총원</th>
          <td>{{ totalMembers }}</td>
        </tr>
        <tr>
          <th>현재원</th>
          <td>{{ totalMembers - (onLeaveMembers + onPassMembers) }}</td>
        </tr>
        <tr>
          <th>열외</th>
          <td>{{ onLeaveMembers + onPassMembers }}</td>
        </tr>
        <tr>
          <th>휴가</th>
          <td>{{ onLeaveMembers }}</td>
        </tr>
        <tr>
          <th>외박</th>
          <td>{{ onPassMembers }}</td>
        </tr>
      </table>
    </div>
  </section>
</template>

<script>
const axios = require('axios')

const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
const day = String(today.getDate()).padStart(2, '0')

const foramttedDate = `${year}-${month}-${day}`

export default {
  middleware: 'auth',

  data() {
    return {
      today: foramttedDate,
      totalMembers: 54,
      onLeaveMembers: 0,
      onPassMembers: 0,
    }
  },

  async mounted() {
    const response = await axios.get(
      'http://localhost:3000/api/v1.0/records/today',
      {
        params: {
          todayDate: `${foramttedDate}`,
        },
      }
    )
    console.log('API response: ', response.data)

    this.onLeaveMembers = response.data.onLeaveResult
    this.onPassMembers = response.data.onPassResult
  },
}
</script>

<style scoped>
.today {
  background-color: #e0f7fa; /* 페이지 배경색 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면을 꽉 채움 */
  padding: 20px;
}

.info-box {
  background-color: white; /* 박스 배경을 흰색으로 설정 */
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 80%;
  max-width: 800px; /* 최대 너비를 800px로 설정 */
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #004d40;
}

h2 {
  font-size: 2rem;
  color: #00796b; /* 날짜 색상 설정 */
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 20px;
  text-align: center;
  font-size: 1.5rem;
}

th {
  background-color: #00796b;
  color: white;
}

td {
  background-color: #f1f1f1;
  font-weight: bold;
}

tr:nth-child(even) td {
  background-color: #78c4cf; /* 행마다 배경색이 바뀌도록 설정 */
}
</style>
