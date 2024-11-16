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
function parseCustomDateFormat(dateString) {
  // '10.27(일)' -> '2024-10-27'로 변환
  const [monthDay, dayName] = dateString.split('(')
  const [month, day] = monthDay.split('.').map(Number)

  const year = month < 11 ? 2025 : 2024

  // 기본 연도를 2024로 설정
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`
}

function extractLeave(reportText) {
  const reports = []
  const reportRegex =
    // 월.일(요일)-월.일(요일) 계급 이름 출타종류/휴가일수+일/휴가종류
    // 전역플래그 g를 통해 여러사람의 데이터를 추출하여 배열로 반환
    /(\d+\.\d+\([가-힣]+\))-(\d+\.\d+\([가-힣]+\))\s+(\S+)\s+(\S+)\s+([^\s/]+)(?:\/(\d+)일)?(?:\/(\S+))?(?:\s*-\s*(.*))?/g

  var match

  while ((match = reportRegex.exec(reportText)) !== null) {
    const report = {
      departureDate: parseCustomDateFormat(match[1]), // 출발일
      returnDate: parseCustomDateFormat(match[2]), // 복귀일
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

function extractOuting(reportText) {
  const outingSectionMatch = reportText.match(
    /3\. 외출신청([\s\S]*?)4\. 건강상태/
  )

  if (!outingSectionMatch) {
    console.error('외출신청 섹션을 찾을 수 없습니다.')
    return []
  }

  const outingSection = outingSectionMatch[1]

  // 외출자 데이터를 추출하는 로직
  const reports = [] // 파싱한 외출자 데이터
  const outingRegex =
    /([가-힣]+\s[가-힣]+)\s+장소:\s*([^\s]+)\s+사유:\s*([^\s]+)\s+시간:\s*(\d{4})/g

  var match

  while ((match = outingRegex.exec(outingSection)) !== null) {
    const report = {
      nameRank: match[1],
      location: match[2],
      reason: match[3],
      time: match[4],
    }
    console.log(report)

    reports.push(report)
  }
  // ... 외출자 데이터 파싱 로직
  return reports
}

export default {
  data() {
    return {
      reportContent: '', // 보고 내용
    }
  },

  middleware: 'auth',

  methods: {
    // 보고를 서버API로 보내는 메소드
    async submitReport() {
      const reports = extractLeave(this.reportContent)
      const outingReports = extractOuting(this.reportContent)

      try {
        const response = await fetch(
          'https://leave-tracker-7jkh.onrender.com/api/records/addInfo',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reports, outingReports }),
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

<style scoped>
/* 페이지 전체 배경 */
.addInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #e0f7fa; /* 페이지 배경색 */

  font-family: Arial, sans-serif;
  padding: 20px;
}

/* 타이틀 스타일 */
.addInfo h1 {
  font-size: 2rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}

/* 입력 박스 */
.input {
  width: 100%;
  max-width: 600px; /* 최대 너비 설정 */
  background: #ffffff; /* 흰색 배경 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 */
  box-sizing: border-box; /* 패딩과 테두리를 포함한 박스 크기 설정 */
}

.input label {
  display: block;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
}

.input textarea {
  width: 100%; /* 부모 컨테이너의 너비를 100%로 설정 */
  height: 150px;
  padding: 15px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 8px;
  resize: none; /* 크기 조절 불가 */
  background-color: #fafafa; /* 연한 회색 배경 */
  color: #333;
  font-family: Arial, sans-serif;
  transition: border-color 0.3s ease;
  box-sizing: border-box; /* 패딩을 포함한 너비 계산 */
}

.input textarea:focus {
  outline: none;
  border-color: #5c6bc0; /* 파란색 테두리 */
}

.input button {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  font-size: 1.1rem;
  background-color: #5c6bc0;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.input button:hover {
  background-color: #3f51b5; /* 버튼 색상 변화 */
}
</style>
