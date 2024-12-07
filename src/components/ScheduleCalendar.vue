<template>
  <div class="calendar">
    <div class="calendar-header">
      <button class="month-button" @click="changeMonth(-1)">&#8249;</button>
      <span>{{ monthNames[month] }} {{ year }}</span>
      <button class="month-button" @click="changeMonth(1)">&#8250;</button>
    </div>

    <!-- Riga per i nomi dei giorni -->
    <div class="calendar-day-names">
      <div v-for="dayName in dayNames" :key="dayName" class="day-name">
        {{ dayName }}
      </div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="day in daysInMonth"
        :key="`${day.year}-${day.month}-${day.date}`"
        :class="[
          'calendar-day',
          {
            disabled: day.isDisabled,
            today:
              `${day.year}-${String(day.month).padStart(2, '0')}-${String(
                day.date
              ).padStart(2, '0')}` === minDate,
            selected: isSelectedDay(day),
          },
        ]"
        @click="!day.isDisabled && selectDay(day)"
        :title="generateTooltip(day)"
      >
        <!-- Data -->
        <div class="date">{{ day.date }}</div>

        <!-- Icone Operazioni -->
        <div class="icon-row operations">
          <img
            v-for="n in day.operations.length"
            :key="'operation-' + n + '-' + day.date"
            :src="operationIcon"
            alt="Operazione"
            class="icon"
          />
        </div>

        <div class="icon-row radiographs">
          <img
            v-for="n in day.radiographs.length"
            :key="'radiograph-' + n + '-' + day.date"
            :src="radiographIcon"
            alt="Radiografia"
            class="icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    month: Number,
    year: Number,
    daysInMonth: Array,
    monthNames: Array,
    dayNames: Array,
    minDate: String,
    operationIcon: String,
    radiographIcon: String,
    showDayDetails: Function,
    changeMonth: Function,
    selectedDay: Object,
  },
  methods: {
    selectDay(day) {
      // Aggiungi una proprietà 'formattedDate' alla data
      const formattedDate = `${day.year}-${String(day.month).padStart(
        2,
        "0"
      )}-${String(day.date).padStart(2, "0")}`;
      this.$emit("update-selected-day", { ...day, formattedDate });
    },
    isSelectedDay(day) {
      // Confronta la data formattata
      return (
        this.selectedDay &&
        this.selectedDay.formattedDate ===
          `${day.year}-${String(day.month).padStart(2, "0")}-${String(
            day.date
          ).padStart(2, "0")}`
      );
    },
    generateTooltip(day) {
      // Ottieni le operazioni per il giorno corrente
      const operations = day.operations || [];
      const numberOfOperations = operations.length;

      // Se non ci sono operazioni
      if (numberOfOperations === 0) {
        return `Nessuna operazione programmata per oggi.`;
      }

      // Estrai gli orari delle operazioni, formattando solo l'ora (HH:mm)
      const operationTimes = operations
        .map((op) => {
          const operationTime = new Date(op.operationDate);
          const hours = String(operationTime.getHours()).padStart(2, "0");
          const minutes = String(operationTime.getMinutes()).padStart(2, "0");
          return `${hours}:${minutes}`;
        })
        .sort(); // Ordina gli orari

      // Se ci sono 3 o più operazioni, usa le virgole per separare gli orari
      let operationText;
      if (numberOfOperations >= 3) {
        operationText = `Hai ${numberOfOperations} operazion${
          numberOfOperations > 1 ? "i" : "e"
        } programmat${
          numberOfOperations > 1 ? "e" : "a"
        } per oggi alle ${operationTimes.slice(0, -1).join(", alle ")} e alle ${
          operationTimes[operationTimes.length - 1]
        }`;
      } else {
        // Se ci sono meno di 3 operazioni, usa "e alle"
        operationText = `Hai ${numberOfOperations} operazion${
          numberOfOperations > 1 ? "i" : "e"
        } programmat${
          numberOfOperations > 1 ? "e" : "a"
        } per oggi alle ${operationTimes.join(" e alle ")}`;
      }

      return operationText;
    },
  },
};
</script>

<style scoped>
.schedule-calendar {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1em;
  margin-bottom: 10px;
}

.month-button {
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 1.5em;
  color: #007bff;
  transition: color 0.3s ease;
}

.month-button:hover {
  color: #0056b3;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.calendar-day {
  position: relative;
  padding: 10px;
  border: 1px solid #ddd;
  height: 70px;
  overflow: hidden;
  cursor: pointer;
}

.calendar-day.disabled {
  opacity: 0.5;
  color: #ccc;
  pointer-events: none;
  background-color: #f9f9f9;
}

.calendar-day.today {
  background-color: #f9f4f4;
  border: 2px solid #ffa8a8db;
  border-radius: 5px;
}

.calendar-day.selected {
  border-radius: 5px;
  border: 2px solid #7bbbffe7;
}

.calendar-day.today.selected {
  background-color: #ffebeb;
  border: 2px solid #7bbbffe7;
}

.calendar-day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f0f0f0;
  padding: 10px 0;
  font-weight: bold;
  color: #555;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.day-name {
  text-transform: uppercase;
  font-size: 0.9em;
}

.icon-row {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.operations {
  min-height: 7px;
  margin-bottom: 3px;
}

.icon {
  width: 7px;
  height: 7px;
}

/* Tooltip */
.tooltip {
  position: absolute;
  top: -25px; /* Posiziona il tooltip sopra la data */
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 10;
  visibility: visible;
  opacity: 0.9;
}
</style>
