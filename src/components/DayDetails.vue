<template>
  <transition
    name="fade"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <div v-if="selectedDay" class="day-details">
      <h2>
        Dettagli del Giorno: {{ selectedDay.date }} {{ monthNames[month] }}
        {{ year }}
      </h2>

      <div v-if="selectedDay.operations.length > 0">
        <h3 class="small-text">Operazioni pianificate:</h3>
        <ul>
          <li v-for="operation in selectedDay.operations" :key="operation.id">
            <strong>{{ operation.type }}</strong
            ><br />
            <span>Data: {{ formatDate(operation.operationDate) }}</span
            ><br />
            <span>Ora: {{ formatTime(operation.operationDate) }}</span
            ><br />
            <span>Descrizione: {{ operation.description }}</span
            ><br />
          </li>
        </ul>
      </div>

      <div v-if="selectedDay.radiographs.length > 0">
        <h3 class="small-text">Radiografie caricate:</h3>
        <ul>
          <li
            v-for="radiograph in selectedDay.radiographs"
            :key="radiograph.name"
          >
            <strong>{{ radiograph.name }}</strong
            ><br />
            <span>{{ radiograph.date }}</span
            ><br />
            <button @click="enlargeRadiograph(radiograph.url)">
              Visualizza Immagine
            </button>
          </li>
        </ul>
      </div>

      <div v-else>
        <p>Non ci sono attività pianificate per questa data.</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    selectedDay: Object,
    monthNames: Array,
    month: Number,
    year: Number,
    formatDate: Function,
    formatTime: Function,
    enlargeRadiograph: Function,
  },
  methods: {
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      el.offsetHeight; // Trigger reflow
      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = 1;
      done();
    },
    leave(el, done) {
      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = 0;
      done();
    },
  },
};
</script>

<style scoped>
.day-details {
  margin-top: 50px;
  text-align: left;
  transition: opacity 0.5s ease;
}

.day-details h2 {
  font-size: 1em;
  margin-bottom: 10px;
}

.day-details p {
  font-size: 0.7em;
  margin-bottom: 10px;
}

.day-details ul {
  list-style-type: none;
  padding: 0;
}

.day-details li {
  margin-bottom: 10px;
}

.day-details button {
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  padding: 10px;
}

.small-text {
  font-size: 0.9rem; /* Puoi regolare la dimensione come preferisci */
  font-weight: 600; /* Opzionale, per mantenere il testo in grassetto */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
