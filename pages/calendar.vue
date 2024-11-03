<template>
  <div>
    <FullCalendar
      ref="calendar"
      :options="calendarOptions"
      @dateClick="handleDateClick"
      @eventClick="handleEventClick"
    />
  </div>
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
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: this.events,
        eventClick: (info) => {
          const leaveType = info.event.extendedProps.leaveType
          const details = info.event.extendedProps.details

          // 세부 사항 표시 (예: alert 또는 modal 사용)
          alert(`출타 종류: ${leaveType}\n세부 사항: ${details}`)
        },
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        },
        eventDidMount: (info) => {
          // 시간 부분을 숨기고 제목만 보여줌
          info.el.querySelector('.fc-event-time').style.display = 'none'
          info.el.querySelector(
            '.fc-event-title'
          ).innerText = `${info.event.title}`
        },
      },
      calendarStart: '2024-11-01',
      calendarEnd: '2024-11-30',
    }
  },

  async mounted() {
    await this.fetch() // 컴포넌트가 마운트될 때 fetch 호출
  },

  methods: {
    async fetch() {
      const response = await this.$axios.get('/records', {
        params: {
          start: this.calendarStart,
          end: this.calendarEnd,
        },
      })

      this.events = response.data.map((record) => {
        return {
          title: `${record.member.rank} ${record.member.name}`,
          start: record.departureDate.split('T')[0] + 'T00:00:00', // 시작일
          end: record.returnDate.split('T')[0] + 'T23:59:59', // 종료일
          color: record.color || 'blue',
          extendedProps: {
            leaveType: record.leaveType || '정보 없음',
            details: record.details || '정보 없음',
          },
        }
      })

      this.$set(this.calendarOptions, 'events', this.events)
    },

    handleDateClick(info) {
      const title = prompt('이벤트 제목을 입력하세요:')
      if (title) {
        this.events.push({
          title: title,
          start: info.dateStr,
        })
        this.$set(this.calendarOptions, 'events', this.events)
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
