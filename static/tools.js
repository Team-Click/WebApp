class ScheduleRenderer {
    constructor(scheduleContainerId) {
      this.scheduleContainer = document.getElementById(scheduleContainerId);
    }
  
    showSchedule(scheduleData) {
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
          ${this.generateTimeRows(scheduleData.schedule)}
        </table>
      `;
      this.scheduleContainer.innerHTML = tableHTML;
    }
  
    generateTimeRows(schedule) {
      const rows = [];
      for (let hour = 7; hour < 24; hour++) {
        for (let half = 0; half < 2; half++) {
          const time = `${String(hour).padStart(2, "0")}:${half === 0 ? "00" : "30"}`;
          rows.push(`<tr><td>${time}</td>${this.generateDayCells(schedule, time)}</tr>`);
        }
      }
      return rows.join("");
    }
  
    generateDayCells(schedule, time) {
      const cells = [];
      for (let day = 1; day <= 5; day++) {
        const classInfo = schedule.find(
          (item) =>
            item.class_days.includes(day) &&
            time >= item.start_time &&
            time < item.end_time
        );
        if (classInfo) {
          cells.push(`<td class="class-cell">${classInfo.class_name}<br>${classInfo.location}</td>`);
        } else {
          cells.push("<td></td>");
        }
      }
      return cells.join("");
    }
  }
  