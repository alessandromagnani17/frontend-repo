<template>
  <div class="calendar-container">
    <h1>Calendario Attività</h1>

    <!-- Verifica se l'utente è un paziente -->
    <div v-if="isPatient">
      <div class="calendar">
        <div class="calendar-header">
          <button @click="changeMonth(-1)">&#8249;</button>
          <span>{{ monthNames[month] }} {{ year }}</span>
          <button @click="changeMonth(1)">&#8250;</button>
        </div>

        <div class="calendar-grid">
          <div
            v-for="day in daysInMonth"
            :key="day.date"
            class="calendar-day"
            @click="showDayDetails(day)"
          >
            <div class="date">{{ day.date }}</div>
            <div v-if="day.radiographs.length > 0" class="radiograph-count">
              {{ day.radiographs.length }}
              {{
                day.radiographs.length === 1
                  ? "caricamento radiografia"
                  : "caricamenti radiografie"
              }}
            </div>
          </div>
        </div>
      </div>

      <!-- Dettagli del giorno selezionato con animazione -->
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
          <p>
            <strong>Paziente:</strong> {{ selectedPatient.name }}
            {{ selectedPatient.family_name }}
          </p>
          <div v-if="selectedDay.radiographs.length > 0">
            <h3>Radiografie caricate:</h3>
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
            <p>Nessuna radiografia caricate per questa data.</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Messaggio per gli altri ruoli (es. medico) -->
    <div v-else>
      <p>Solo i pazienti possono vedere le loro radiografie nel calendario.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ActivityCalendar",
  data() {
    return {
      loadingPrediction: false,
      successMessage: "",
      month: new Date().getMonth(), // Mese corrente
      year: new Date().getFullYear(), // Anno corrente
      radiographs: [], // Le radiografie caricate
      selectedDay: null, // Giorno selezionato
      monthNames: [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
      ],
      isPatient: false, // Indica se l'utente è un paziente
      patientId: null, // ID del paziente
      selectedPatient: null, // Paziente selezionato (loggato)
    };
  },
  mounted() {
    this.checkUserRole();
    if (this.isPatient) {
      this.loadRadiographs();
    }
  },
  computed: {
    daysInMonth() {
      const days = [];
      const lastDayOfMonth = new Date(this.year, this.month + 1, 0);
      const totalDays = lastDayOfMonth.getDate();

      for (let i = 1; i <= totalDays; i++) {
        const dayDate = new Date(this.year, this.month, i);
        const radiographsOnDay = this.radiographs.filter(
          (radiograph) =>
            new Date(radiograph.date).toDateString() === dayDate.toDateString()
        );

        days.push({
          date: i,
          radiographs: radiographsOnDay,
        });
      }
      return days;
    },
  },
  methods: {
    checkUserRole() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.role === "patient") {
        this.isPatient = true;
        this.patientId = userData.userId; // Recupera l'ID del paziente dal localStorage
        this.selectedPatient = userData; // Imposta il paziente selezionato
        console.log("Ruolo utente: Paziente");
      } else {
        this.isPatient = false;
        console.log("Ruolo utente: Non paziente");
      }
    },

    async loadRadiographs() {
      if (!this.patientId) {
        console.error("ID paziente non trovato.");
        return;
      }

      try {
        const response = await fetch(
          `/api/patients/${this.patientId}/radiographs`
        );
        if (response.ok) {
          const data = await response.json();
          this.radiographs = data;
        } else {
          console.error("Errore nel recupero delle radiografie");
        }
      } catch (error) {
        console.error("Errore di connessione al server:", error);
      }
    },

    showDayDetails(day) {
      if (this.selectedDay && this.selectedDay.date === day.date) {
        this.selectedDay = null;
      } else {
        this.selectedDay = day;
      }
      console.log(`Giorno selezionato: ${day.date}`);
    },

    enlargeRadiograph(url) {
      this.modalImageUrl = url;
      this.isModalOpen = true;
    },

    changeMonth(direction) {
      if (direction === 1) {
        if (this.month === 11) {
          this.month = 0;
          this.year++;
        } else {
          this.month++;
        }
      } else {
        if (this.month === 0) {
          this.month = 11;
          this.year--;
        } else {
          this.month--;
        }
      }
    },

    // Animazioni di transizione
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      el.offsetHeight; // trigger reflow
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
/* Stili generali per il calendario */
.calendar-container {
  width: 100%;
  padding: 20px;
  text-align: center;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  margin-bottom: 10px;
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
  height: 100px;
  overflow: hidden;
  cursor: pointer;
}

.date {
  font-size: 1.2em;
}

.radiograph-count {
  position: absolute;
  bottom: 10px;
  left: 5px;
  font-size: 0.9em;
  color: #007bff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

button {
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.5em;
}

button:hover {
  color: #007bff;
}

/* Animazione della transizione */
.day-details {
  margin-top: 20px;
  text-align: left;
  transition: opacity 0.5s ease;
}

.day-details h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.day-details p {
  font-size: 1.2em;
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

/* Transizione Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
