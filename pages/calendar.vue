<template>
  <section>
    <div class="filter">
      <label for="unit">소속 중대/대대 선택:</label>
      <select id="unit" v-model="selectedUnit" @change="filterByUnit">
        <option value="">모두</option>
        <option v-for="unit in units" :key="unit" :value="unit">
          {{ unit }}
        </option>
      </select>
    </div>
    <div>
      <button @click="filterEvents('휴가')">휴가만 보기</button>
      <button @click="filterEvents('특이외박')">외박만 보기</button>
      <button @click="filterEvents('all')">모두 보기</button>
    </div>
    <FullCalendar
      ref="calendar"
      :events="events"
      :options="calendarOptions"
      @dateClick="handleDateClick"
      @eventClick="handleEventClick"
    />
  </section>
</template>

<script>
const FullCalendar = require('@fullcalendar/vue').default // FullCalendar Vue 컴포넌트
const dayGridPlugin = require('@fullcalendar/daygrid').default // 월별 뷰 플러그인
const interactionPlugin = require('@fullcalendar/interaction').default // 상호작용 플러그인

export default {
  components: {
    FullCalendar,
  },
  data() {
    return {
      events: [],
      filteredEvents: [],
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        eventClick: (info) => {
          const leaveType = info.event.extendedProps.leaveType
          const details = info.event.extendedProps.details

          // 세부 사항 표시 (예: alert 또는 modal 사용)
          alert(`출타 종류: ${leaveType}\n세부 사항: ${details}`)
        },
        height: 'auto',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        },
        eventContent: function (arg) {
          return {
            html: `<div class="custom-event-content">${arg.event.title}</div>`,
          }
        },
        eventDidMount: (info) => {
          // 시간 부분을 숨기고 제목만 보여줌
          const timeElement = info.el.querySelector('.fc-event-time')
          if (timeElement) timeElement.style.display = 'none' // 시간을 숨김
          info.el.classList.remove('fc-daygrid-event-dot')
          info.el.style.backgroundColor = info.event.backgroundColor || 'green'
        },
      },
      selectedCategory: 'all',
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
    await this.fetch() // 컴포넌트가 마운트될 때 fetch 호출
  },

  middleware: 'auth',

  methods: {
    async fetch() {
      const response = await this.$axios.get(
        'https://leave-tracker-7jkh.onrender.com/api/records',
        {
          params: {
            start: '2024-10-20',
            end: '2025-01-31',
          },
        }
      )
      console.log('API response:', response.data) // 응답 데이터 로그

      this.events = response.data.map((record) => {
        const isSingleDayEvent = record.departureDate === record.returnDate

        const startDate = new Date(record.departureDate)
          .toISOString()
          .slice(0, 10)
        const endDate = isSingleDayEvent
          ? startDate // 하루만 있는 경우 end와 start를 동일하게 설정
          : new Date(
              new Date(record.returnDate).getTime() + 24 * 60 * 60 * 1000
            )
              .toISOString()
              .slice(0, 10)
        return {
          id: record.id,
          title: `${record.member.rank} ${record.member.name}`,
          start: startDate,
          end: endDate,
          allday: true,
          color: record.color || '',
          extendedProps: {
            leaveType: record.leaveType || '정보 없음',
            details: record.details || '정보 없음',
            unit: record.member.unit,
          },
        }
      })

      console.log(this.events)

      this.filteredEvents = [...this.events]
      this.$set(this.calendarOptions, 'events', this.events)
    },

    filterEvents(category) {
      if (category === 'all') {
        this.filteredEvents = [...this.events]
      } else {
        this.filteredEvents = this.events.filter((event) => {
          return event.extendedProps.leaveType === category
        })
      }

      this.filteredEvents = [...this.events]

      // 필터링된 이벤트를 FullCalendar에 전달
      // calendar 컴포넌트를 참조하여 새로고침
      this.$set(this.calendarOptions, 'events', this.filteredEvents)
      this.$refs.calendar.getApi().render() // 캘린더 강제로 리렌더링
    },

    filterEvents(category) {
      this.selectedCategory = category
      this.applyFilters()
    },

    filterByUnit() {
      this.applyFilters()
    },

    applyFilters() {
      // 카테고리 및 대대 필터를 동시에 적용
      this.filteredEvents = this.events.filter((event) => {
        const categoryMatch =
          this.selectedCategory === 'all' ||
          event.extendedProps.leaveType === this.selectedCategory
        const unitMatch =
          !this.selectedUnit || event.extendedProps.unit === this.selectedUnit
        return categoryMatch && unitMatch
      })

      // 필터링된 이벤트를 FullCalendar에 전달하고 강제 리렌더링
      this.$set(this.calendarOptions, 'events', this.filteredEvents)
      this.$refs.calendar.getApi().render()
    },

    handleDateClick(info) {
      const title = prompt('이벤트 제목을 입력하세요:')
      if (title) {
        this.events.push({
          title: title,
          start: info.dateStr,
        })
      }
    },
    handleEventClick(info) {
      const { leaveType, details } = info.event.extendedProps
      alert(
        `이벤트: ${info.event.title}\n출타 종류: ${leaveType}\n세부사항: ${details}`
      )
    },
  },
}
</script>

<style scoped>
/* 모든 fc-daygrid-event-dot 클래스 요소의 배경색을 초록색으로 강제 설정 */
.fc-daygrid-event-dot {
  display: none !important; /* dot 표시 강제로 숨기기 */
}

/* 이벤트 제목 스타일: 가운데 정렬 및 글씨 굵게 */
::v-deep .fc-h-event .fc-event-main {
  color: #5a5555 !important; /* 글꼴 색을 어두운 회색으로 설정 */
  font-weight: bold !important; /* 글씨 굵게 */
  text-align: center !important; /* 가운데 정렬 */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 전체 페이지 배경 */
section {
  background: linear-gradient(
    to bottom,
    #f0f4f8,
    #d9e4f5
  ); /* 부드러운 그라데이션 배경 */
  font-family: Arial, sans-serif;
  padding: 20px;
  min-height: 100vh;
}

/* 필터 영역 스타일 */
.filter {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  background-color: #ffffff; /* 흰색 배경 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
  width: 100%;
  max-width: 600px; /* 최대 너비 설정 */
  margin: 0 auto 20px auto;
}

.filter label {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.filter select {
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #ccc;
  width: 100%;
  max-width: 300px; /* 최대 너비 설정 */
  margin-top: 10px;
  background-color: #fafafa;
  color: #333;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.filter select:focus {
  outline: none;
  border-color: #5c6bc0; /* 포커스 시 테두리 색상 */
}

/* 출타별 보기 버튼 스타일 */
div {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

div button {
  padding: 12px 20px;
  font-size: 1.1rem;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 150px; /* 버튼 크기 고정 */
}

div button:hover {
  background-color: #3f51b5; /* 버튼 색상 변화 */
}
</style>
