class ScheduleRenderer {
    constructor(scheduleContainerId) {
        this.scheduleContainer = document.getElementById(scheduleContainerId);
    }
  
    showSchedule(scheduleData) {
        const { earliestTime, latestTime } = this.calculateTimeRange(scheduleData.schedule);
  
        const tableHTML = `
            <table class="schedule-table">
                <tr>
                    <th>시간</th>
                    <th>월</th>
                    <th>화</th>
                    <th>수</th>
                    <th>목</th>
                    <th>금</th>
                </tr>
                ${this.generateTimeRows(scheduleData.schedule, earliestTime, latestTime)}
            </table>
        `;
        this.scheduleContainer.innerHTML = tableHTML;
    }
  
    calculateTimeRange(schedule) {
        let earliestTime = "24:00";
        let latestTime = "00:00";
  
        schedule.forEach((item) => {
            if (item.start_time < earliestTime) earliestTime = item.start_time;
            if (item.end_time > latestTime) latestTime = item.end_time;
        });
  
        return { earliestTime, latestTime };
    }
  
    generateTimeRows(schedule, earliestTime, latestTime) {
        const rows = [];
        const mergedCells = {}; // 병합 상태를 추적
  
        for (let hour = 7; hour < 24; hour++) {
            for (let half = 0; half < 2; half++) {
                const time = `${String(hour).padStart(2, "0")}:${half === 0 ? "00" : "30"}`;
  
                // 시간 범위 필터링
                if (time < earliestTime || time >= latestTime) {
                    continue;
                }
  
                rows.push(`<tr><td>${time}</td>${this.generateDayCells(schedule, time, mergedCells)}</tr>`);
            }
        }
        return rows.join("");
    }
  
    generateDayCells(schedule, time, mergedCells) {
        const cells = [];
        for (let day = 1; day <= 5; day++) {
            // 이미 병합된 셀은 건너뜀
            if (mergedCells[`${day}-${time}`]) {
                continue;
            }
    
            // 현재 시간과 요일에 맞는 수업 정보를 찾음
            const classInfo = schedule.find(
                (item) =>
                    item.day === day && // 요일 필터
                    time >= item.start_time && // 시작 시간 조건
                    time < item.end_time // 종료 시간 조건
            );
    
            if (classInfo) {
                // 병합된 시간의 개수를 계산
                const rowspan = this.calculateRowSpan(classInfo, day, schedule);
    
                // 병합된 셀 추가
                cells.push(
                    `<td class="class-cell" rowspan="${rowspan}">
                        ${classInfo.class_name}<br>${classInfo.location}
                    </td>`
                );
    
                // 병합된 시간대를 기록
                this.markMergedCells(classInfo, day, mergedCells);
            } else {
                cells.push("<td></td>");
            }
        }
        return cells.join("");
    }
  
    calculateRowSpan(classInfo, day, schedule) {
        const startHour = parseInt(classInfo.start_time.split(":")[0], 10);
        const startMinute = parseInt(classInfo.start_time.split(":")[1], 10);
        const endHour = parseInt(classInfo.end_time.split(":")[0], 10);
        const endMinute = parseInt(classInfo.end_time.split(":")[1], 10);
  
        // 시간 차이 계산 (단위: 30분 간격)
        return ((endHour - startHour) * 60 + (endMinute - startMinute)) / 30;
    }
  
    markMergedCells(classInfo, day, mergedCells) {
        const startHour = parseInt(classInfo.start_time.split(":")[0], 10);
        const startMinute = parseInt(classInfo.start_time.split(":")[1], 10);
        const endHour = parseInt(classInfo.end_time.split(":")[0], 10);
        const endMinute = parseInt(classInfo.end_time.split(":")[1], 10);
  
        for (let hour = startHour; hour <= endHour; hour++) {
            for (let half = 0; half < 2; half++) {
                const minute = half === 0 ? 0 : 30;
                const currentTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  
                if (currentTime >= classInfo.start_time && currentTime < classInfo.end_time) {
                    mergedCells[`${day}-${currentTime}`] = true;
                }
            }
        }
    }
  }
  