<template>
  <section class="addInfo">
    <h1>Paste informations in this page!</h1>

    <!-- 보고 내용 입력 -->
    <div class="input">
      <form @submit.prevent="submitReport">
        <label for="report">보고 내용:</label>
        <textarea
          id="report"
          v-model="reportContent"
          placeholder="보고 내용을 입력하시오."
        ></textarea>
        <button type="submit">등록</button>
      </form>
    </div>
  </section>
</template>

<script>
function extractInfo(reportText) {
  const reports = []
  const reportRegex =
    // 월.일(요일)-월.일(요일) 계급 이름 출타종류/휴가일수+일/휴가종류
    // 전역플래그 g를 통해 여러사람의 데이터를 추출하여 배열로 반환
    /(\d+\.\d+\([가-힣]+\))-(\d+\.\d+\([가-힣]+\))\s+(\S+)\s+(\S+)\s+(\S+)\/(\d+)일\/(\S+)(?:\s*-\s*(.+))?/g

  var match
  while ((match = reportRegex.exec(reportText)) !== null) {
    const report = {
      departureDate: match[1], // 출발일
      returnDate: match[2], // 복귀일
      rank: match[3], // 계급
      name: match[4], // 이름
      leaveType: match[5], // 출타 종류, 여기까지 필수 항목
      duration: match[6] || null, // 기간 (휴가일경우)
      details: match[7] || null, // 휴가 종류 (휴가일경우)
      comments: match[8] || null, // 추가 설명 (휴가설명 및 특이외박 사유)
    }

    console.log(report)

    reports.push(report)
  }

  return reports
}

export default {
  data() {
    return {
      reportContent: '', // 보고 내용
    }
  },
  methods: {
    // 보고를 서버API로 보내는 메소드
    async submitReport() {
      const reports = extractInfo(this.reportContent)

      try {
        const response = await fetch(
          'http://localhost:3000/api/v1.0/records/addInfo',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reports }),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to submit reports')
        }

        const result = await response.json()
        console.log('Successfully Submitted:', result)
      } catch (error) {
        console.error('Error Submitting reports:', error)
      }
    },
  },
}
</script>
