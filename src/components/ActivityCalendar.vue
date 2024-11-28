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
      <transition name="slide">
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
      // Verifica il ruolo dell'utente
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
      // Carica le radiografie dal backend solo per il paziente loggato
      if (!this.patientId) {
        console.error("ID paziente non trovato.");
        return;
      }

      try {
        console.log(
          "Caricamento radiografie per paziente con ID:",
          this.patientId
        );

        const response = await fetch(
          `/api/patients/${this.patientId}/radiographs`
        );

        if (response.ok) {
          const data = await response.json();
          this.radiographs = data;

          // Stampa le informazioni sulle radiografie caricate
          console.log("Radiografie ricevute dal backend:", this.radiographs);

          // Aggiungi un loop per stampare tutte le informazioni sulle singole radiografie
          this.radiographs.forEach((radiograph, index) => {
            console.log(`Radiografia ${index + 1}:`);
            console.log(`Nome: ${radiograph.name}`);
            console.log(`Data: ${radiograph.date}`);
            console.log(`URL: ${radiograph.url}`);
            console.log(`Descrizione: ${radiograph.description}`);
          });
        } else {
          console.error("Errore nel recupero delle radiografie");
        }
      } catch (error) {
        console.error("Errore di connessione al server:", error);
      }
    },

    showDayDetails(day) {
      // Se il giorno è già selezionato, chiudi i dettagli
      if (this.selectedDay && this.selectedDay.date === day.date) {
        this.selectedDay = null;
      } else {
        this.selectedDay = day;
      }
      console.log(`Giorno selezionato: ${day.date}`);
    },

    enlargeRadiograph(url) {
      // Visualizza l'immagine della radiografia in modalità ingrandita
      this.modalImageUrl = url;
      this.isModalOpen = true;
    },

    changeMonth(direction) {
      // Cambia mese
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

/* Animazione di scorrimento con effetto parallax e 3D */
.day-details-container {
  position: relative;
  width: 80%;
  max-width: 600px;
  margin: 0 auto;
  perspective: 1200px; /* Aumentato per un effetto 3D più profondo */
  z-index: 100;
}

.day-details-card {
  position: absolute;
  width: 100%;
  height: auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform-style: preserve-3d;
  transform: rotateY(0deg) translateZ(0px);
  transition: transform 1s ease-in-out, box-shadow 0.3s ease;
  will-change: transform, box-shadow;
}

/* Aggiungi il parallax durante l'interazione */
.day-details-card:hover {
  transform: rotateY(5deg) translateZ(100px);
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.4);
}

.day-details-card.open {
  transform: rotateY(180deg) translateZ(100px);
}

/* Lato frontale (con la data e l'intestazione principale) */
.day-details-card .front {
  padding: 15px;
  background: linear-gradient(135deg, #ff007c, #ff4c4c);
  color: #fff;
  border-radius: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  transform: rotateY(0deg);
  backface-visibility: hidden;
  position: relative;
}

.day-details-card .front h2 {
  font-size: 1.2em; /* Testo ridotto */
  margin: 0;
}

.day-details-card .front p {
  font-size: 0.9em; /* Testo ridotto */
  margin-top: 8px;
  font-weight: 300;
  color: #f0f0f0;
}

/* Lato posteriore (dettagli delle radiografie) */
.day-details-card .back {
  padding: 15px;
  background: #f7f7f7;
  color: #333;
  border-radius: 20px;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.day-details-card.open .back {
  opacity: 1;
}

/* Dettaglio delle radiografie */
.day-details-card .back ul {
  list-style-type: none;
  padding-left: 0;
}

.day-details-card .back ul li {
  margin-bottom: 8px;
  font-size: 0.85em; /* Testo ridotto */
  font-weight: 300;
  color: #555;
  position: relative;
}

.day-details-card .back ul li:before {
  content: "•";
  position: absolute;
  left: -15px;
  top: 0;
  font-size: 1.5em;
  color: #007bff;
}

/* Pulsante interattivo con micro-animazioni */
.day-details-card .back button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.day-details-card .back button:hover {
  background-color: #0056b3;
  transform: scale(1.1);
}

/* Overlay con sfocatura dinamica */
.day-details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease-in-out;
}

.day-details-overlay.visible {
  opacity: 1;
  visibility: visible;
}

/* Micro-interazione di illuminazione */
body {
  background: #f0f0f0;
  transition: background 0.3s ease;
}

body:hover {
  background: #e1e1e1;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin: 10px 0;
}

li button {
  font-size: 1em;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  border: none;
}

li button:hover {
  background-color: #0056b3;
}

/* Transizione scorrimento */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateY(-20px);
}
</style>
