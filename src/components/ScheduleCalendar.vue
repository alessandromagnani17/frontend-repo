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
          },
        ]"
        @click="!day.isDisabled && showDayDetails(day)"
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
  background: none; /* Nessun sfondo */
  border: none; /* Nessun bordo */
  padding: 5px; /* Spazio interno per clic comodamente */
  cursor: pointer; /* Cambia il cursore per indicare che è cliccabile */
  font-size: 1.5em; /* Dimensione del carattere per renderlo visibile */
  color: #007bff; /* Colore blu per l’icona del pulsante */
  transition: color 0.3s ease; /* Animazione per un tocco moderno */
}

.month-button:hover {
  color: #0056b3; /* Cambia colore al passaggio del mouse */
}

.month-button:focus {
  outline: none; /* Rimuove il bordo di focus */
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
  border: 2px solid #fc2424db;
  border-radius: 5px;
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

.activity-icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
</style>
