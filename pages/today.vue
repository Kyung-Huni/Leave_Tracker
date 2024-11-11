<template>
  <section class="today">
    <h1>Today's info!</h1>
    <h2>{{ today }}</h2>
    <table>
      <tr>
        <th>총원</th>
        <td>{{ totalMembers }}</td>
      </tr>
      <tr>
        <th>현재원</th>
        {{
          totalMembers - (onLeaveMembers + onPassMembers)
        }}
      </tr>
      <tr>
        <th>열외</th>
        {{
          onLeaveMembers + onPassMembers
        }}
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
