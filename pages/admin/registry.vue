<template>
  <section class="registry">
    <h1>Add Unit Members!</h1>

    <div class="submit">
      <form @submit.prevent="registry">
        <label for="계급">계급</label>
        <input type="text" v-model="rank" />
        <label for="이름">이름</label>
        <input type="text" v-model="name" />
        <label for="소속">소속</label>
        <select v-model="unit">
          <option v-for="cate in categories" v-bind:value="cate" :key="cate">
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
      categories: [
        '501 본부중대',
        '3정보 본부중대',
        '3정보 A/B',
        '3정보 찰리',
        '524정보대대',
      ],
      rank: '',
      name: '',
      unit: '',
    }
  },
  methods: {
    async registry() {
      try {
        const response = await fetch(
          'http://localhost:3000/api/v1.0/admin/registry',
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
          console.log('Successfully Added: ', result)
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
