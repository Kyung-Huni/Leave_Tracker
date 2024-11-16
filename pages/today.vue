<template>
  <section class="today">
    <div class="container">
      <!-- 좌측: 외출자 명단 -->
      <div class="outing-info">
        <h1>Today's info</h1>
        <h2>{{ today }}</h2>

        <h2>외출자 명단 - {{ outingMembers }}명</h2>
        <ul class="outing-list">
          <li
            v-for="(member, index) in outingResults"
            :key="index"
            class="member-card"
          >
            <strong>{{ member.nameRank }}</strong>
            <p>장소: {{ member.location }}</p>
            <p>사유: {{ member.reason }}</p>
            <p>시간: {{ member.time }}</p>
          </li>
        </ul>
      </div>

      <!-- 우측: 현재원 표 -->
      <div class="info-box">
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
    </div>
  </section>
</template>

<script>
const axios = require('axios')

const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
const day = String(today.getDate()).padStart(2, '0')

const formattedDate = `${year}-${month}-${day}`

export default {
  middleware: 'auth',

  data() {
    return {
      today: formattedDate,
      totalMembers: 54,
      onLeaveMembers: 0,
      onPassMembers: 0,
      outingMembers: 0,
      outingResults: [],
    }
  },

  async mounted() {
    const response = await axios.get(
      'http://localhost:3000/api/v1.0/records/today',
      {
        params: {
          todayDate: `${formattedDate}`,
        },
      }
    )
    console.log('API response: ', response.data)

    this.onLeaveMembers = response.data.onLeaveResult
    this.onPassMembers = response.data.onPassResult
    this.outingMembers = response.data.outingCount
    this.outingResults = response.data.outingResult

    console.log(this.outingResults)
  },
}
</script>

<style scoped>
.today {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #e0f7fa;
  height: 100vh;
  padding: 20px;
}

.container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.outing-info {
  flex: 1;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-right: 20px;
}

.info-box {
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5rem;
  color: #004d40;
  margin-bottom: 10px;
}

h2 {
  font-size: 2rem;
  color: #00796b;
  margin-bottom: 20px;
}

ul.outing-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.member-card {
  width: 48%; /* 2열 배치 */
  padding: 15px;
  margin-bottom: 15px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.member-card strong {
  display: block;
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
}

.member-card p {
  margin: 5px 0;
  color: #555;
  font-size: 1em;
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
  background-color: #78c4cf;
}
</style>
