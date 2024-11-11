<template>
  <section class="members">
    <h1>Members List!</h1>

    <div class="filter">
      <label for="unit">소속 중대/대대 선택:</label>
      <select id="unit" v-model="selectedUnit" @change="filterByUnit">
        <option value="">모두</option>
        <option v-for="unit in units" :key="unit" :value="unit">
          {{ unit }}
        </option>
      </select>
    </div>

    <div class="container">
      <table>
        <tr v-for="member in filteredMembers" :key="member['id']">
          <td>{{ member['rank'] }}</td>
          <td>{{ member['name'] }}</td>
          <td>{{ member['unit'] }}</td>
        </tr>
      </table>

      <div class="pagination">
        <a href="#" @click="getPage(p)" v-for="p in pagination" :key="p">{{
          p + 1
        }}</a>
      </div>
    </div>
  </section>
</template>

<script>
const axios = require('axios')

function getPagination({ currentPage, totalCount, limit }) {
  var pn = []
  var maxPage = Math.floor(totalCount / limit)
  for (var i = currentPage - 3; i < currentPage + 3 && i <= maxPage; i++) {
    if (i > -1) {
      pn.push(i)
    }
  }
  return pn
}

export default {
  data() {
    return {
      members: [],
      filteredMembers: [],
      totalCount: 0,
      limit: 5,
      currentPage: 0,
      pagination: [],
      selectedUnit: '',
      units: [
        '501 본부중대',
        '3정보 본부중대',
        '3정보 A/B',
        '3정보 찰리',
        '524정보대대',
      ],
    }
  },

  async mounted() {
    var data = await axios.get('http://localhost:3000/api/v1.0/members')

    ;(this.members = data.data.member),
      (this.totalCount = data.data.totalCount),
      (this.limit = data.data.limit),
      (this.currentPage = data.data.currentPage),
      (this.pagination = getPagination({
        currentPage: data.data.currentPage,
        totalCount: data.data.totalCount,
        limit: data.data.limit,
      })),
      (this.filteredMembers = this.members)
  },

  watch: {
    selectedUnit() {
      this.filteredMembers = this.selectedUnit
        ? this.members.filter((member) => member.unit === this.selectedUnit)
        : this.members
    },
  },

  middleware: 'auth',

  methods: {
    async getPage(page) {
      var url = `http://localhost:3000/api/v1.0/members?page=${page}`
      var data = await axios.get(url)

      this.members = data.data.member
      this.totalCount = data.data.totalCount
      this.limit = data.data.limit
      this.currentPage = data.data.currentPage
      this.pagination = getPagination({
        currentPage: data.data.currentPage,
        totalCount: data.data.totalCount,
        limit: data.data.limit,
      })

      this.filteredMembers = this.selectedUnit
        ? this.members.filter((m) => m.unit === this.selectedUnit)
        : this.members
    },

    filterByUnit() {
      if (this.selectedUnit) {
        this.filteredMembers = this.members.filter(
          (member) => member.unit === this.selectedUnit
        )
      } else {
        this.filteredMembers = this.members
      }
    },
  },
}
</script>
