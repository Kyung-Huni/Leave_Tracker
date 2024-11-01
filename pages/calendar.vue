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
      events: [
        { title: 'Event 1', start: '2024-11-01' },
        { title: 'Event 2', start: '2024-11-05' },
      ],
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: [],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay',
        },
      },
    }
  },
  mounted() {
    this.$refs.calendar.getApi().addEventSource(this.events) // 이벤트 수동 추가
  },
  methods: {
    handleDateClick(info) {
      const title = prompt('이벤트 제목을 입력하세요:')
      if (title) {
        const newEvent = { title: title, start: info.dateStr }
        this.events.push(newEvent)
        this.$refs.calendar.getApi().addEvent(newEvent) // 이벤트 수동으로 달력에 추가
      }
    },

    handleEventClick(info) {
      alery(`이벤트: ${info.event.title}`)
    },
  },
}
</script>
