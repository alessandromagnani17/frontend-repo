<template>
  <div class="calendar-container">
    <h1>Calendario Attività</h1>
    <button @click="openScheduleModal" class="btn btn-primary">
      Pianifica Operazione
    </button>

    <!-- Modale per inserire i dettagli dell'operazione -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Pianifica una nuova operazione</h2>
        <!-- Menu a tendina per selezionare un paziente -->
        <label for="patientSelect">Seleziona un paziente:</label>
        <select
          v-model="selectedPatientId"
          id="patientSelect"
          class="form-select"
        >
          <option value="" disabled>Seleziona un paziente</option>
          <option
            v-for="patient in patients"
            :key="patient.userId"
            :value="patient.userId"
          >
            {{ patient.name }} {{ patient.family_name }}
          </option>
        </select>

        <label for="operationDate">Data dell'operazione:</label>
        <input
          type="date"
          v-model="operationDate"
          id="operationDate"
          :min="minDate"
        />

        <label for="operationTime">Ora dell'operazione:</label>
        <input type="time" v-model="operationTime" id="operationTime" />

        <label for="description">Descrizione:</label>
        <textarea v-model="description" id="description"></textarea>

        <button @click="scheduleOperation" class="btn btn-success">
          Salva
        </button>
        <button @click="closeScheduleModal" class="btn btn-secondary">
          Annulla
        </button>
      </div>
    </div>
    <!-- Verifica se l'utente è un paziente o un dottore -->
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

            <!-- Icone Radiografie -->
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
            <p>Nessuna radiografia caricata per questa data.</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Se l'utente è un dottore, visualizza tutte le radiografie dei pazienti -->
    <div v-else>
      <div v-if="isDoctor">
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

              <!-- Icone Radiografie -->
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
          <div
            v-for="radiograph in selectedDay.radiographs"
            :key="radiograph.name"
          >
            <p>
              <strong>{{ radiograph.patientName }}:</strong>
              {{ radiograph.name }}
            </p>
            <button @click="enlargeRadiograph(radiograph.url)">
              Visualizza Immagine
            </button>
          </div>
        </div>
      </transition>
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
      operations: [],
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
      isDoctor: false, // Indica se l'utente è un dottore
      selectedPatient: null, // Paziente selezionato (loggato)
      selectedPatientId: "",
      patients: [], // Pazienti associati al dottore
      showModal: false, // Controlla la visibilità del modale
      operationDate: "", // Data dell'operazione
      operationTime: "",
      description: "", // Descrizione dell'operazione
      minDate: new Date().toISOString().split("T")[0], // Data minima (oggi)
      operationIcon: require("@/assets/operation-icon.png"),
      radiographIcon: require("@/assets/radiograph-icon.png"),
    };
  },
  mounted() {
    this.checkUserRole();
    if (this.isDoctor) {
      this.loadPatients(); // Carica i pazienti del dottore
    }
    if (this.isPatient) {
      this.loadRadiographs(); // Carica le radiografie del paziente loggato
      this.loadOperations();
      this.refreshCalendar();
    }
  },
  computed: {
    daysInMonth() {
      const days = [];
      const lastDayOfMonth = new Date(this.year, this.month + 1, 0);
      const totalDays = lastDayOfMonth.getDate();

      // Crea un array per tenere traccia delle radiografie per ogni giorno
      const radiographsPerDay = {};

      // Crea un array per tenere traccia delle operazioni per ogni giorno
      const operationsPerDay = {};

      if (this.isDoctor) {
        console.log("DEBUG: Utente loggato come medico.");
        // Aggrega tutte le radiografie dei pazienti associati al dottore
        this.patients.forEach((patient) => {
          console.log(
            `DEBUG: Elaborazione paziente: ${patient.name} ${patient.family_name}`
          );
          if (patient.radiographs) {
            patient.radiographs.forEach((radiograph) => {
              const radiographDate = new Date(radiograph.date).toDateString();
              if (!radiographsPerDay[radiographDate]) {
                radiographsPerDay[radiographDate] = [];
              }
              radiographsPerDay[radiographDate].push({
                ...radiograph,
                patientName: `${patient.name} ${patient.family_name}`,
              });
            });
          }

          // Debug per le operazioni dei pazienti
          if (patient.operations) {
            console.log(
              `DEBUG: Operazioni del paziente ${patient.name} ${patient.family_name}:`,
              patient.operations
            );
            patient.operations.forEach((operation) => {
              // Conversione esplicita della data
              if (!operation.operationDate) {
                console.warn(
                  `DEBUG: Operazione senza data trovata:`,
                  operation
                );
                return; // Salta questa operazione
              }

              // Conversione della data con parsing robusto
              const operationDate = this.parseISODate(operation.operationDate);
              console.log(
                `DEBUG: Data operazione convertita: ${operationDate}, Operazione:`,
                operation
              );

              if (operationDate !== "Invalid Date") {
                if (!operationsPerDay[operationDate]) {
                  operationsPerDay[operationDate] = [];
                }
                operationsPerDay[operationDate].push({
                  ...operation,
                  patientName: `${patient.name} ${patient.family_name}`,
                });
              } else {
                console.warn(
                  `DEBUG: Operazione scartata a causa di una data non valida:`,
                  operation
                );
              }
            });
          }
          console.log("DEBUG: daysInMonth", this.daysInMonth);
        });
      } else {
        console.log("DEBUG: Utente loggato come paziente.");
        // Se l'utente è un paziente, usa le proprie radiografie
        this.radiographs.forEach((radiograph) => {
          const radiographDate = new Date(radiograph.date).toDateString();
          if (!radiographsPerDay[radiographDate]) {
            radiographsPerDay[radiographDate] = [];
          }
          radiographsPerDay[radiographDate].push(radiograph);
        });

        // Debug per le operazioni del paziente
        console.log("DEBUG: Operazioni del paziente:", this.operations);
        this.operations.forEach((operation) => {
          if (!operation.operationDate) {
            console.warn("DEBUG: Operazione senza data trovata:", operation);
            return; // Salta questa operazione
          }

          const operationDate = this.parseISODate(operation.operationDate);
          console.log(
            `DEBUG: Data operazione convertita: ${operationDate}, Operazione:`,
            operation
          );

          if (operationDate !== "Invalid Date") {
            if (!operationsPerDay[operationDate]) {
              operationsPerDay[operationDate] = [];
            }
            operationsPerDay[operationDate].push(operation);
          } else {
            console.warn(
              `DEBUG: Operazione scartata a causa di una data non valida:`,
              operation
            );
          }
        });
      }

      // Popola i giorni del mese
      for (let i = 1; i <= totalDays; i++) {
        const dayDate = new Date(this.year, this.month, i).toDateString();
        const radiographsOnDay = radiographsPerDay[dayDate] || [];
        const operationsOnDay = operationsPerDay[dayDate] || [];

        // Debug per le operazioni aggregate per giorno
        console.log(
          `DEBUG: Giorno: ${dayDate}, Operazioni trovate:`,
          operationsOnDay
        );

        days.push({
          date: i,
          radiographs: radiographsOnDay,
          operations: operationsOnDay,
        });
      }

      console.log("DEBUG: Struttura finale dei giorni:", days);
      return days;
    },
  },
  methods: {
    openScheduleModal() {
      this.showModal = true;
    },
    // Chiude il modale
    closeScheduleModal() {
      this.showModal = false;
      this.operationDate = "";
      this.description = "";
    },
    async scheduleOperation() {
      try {
        // Controlla che i campi non siano vuoti
        if (
          !this.selectedPatientId ||
          !this.operationDate ||
          !this.operationTime ||
          !this.description
        ) {
          alert("Data, ora o descrizione mancanti.");
          return;
        }

        // Recupera l'ID del dottore e del paziente
        const doctorId = localStorage.getItem("doctorId");

        // Verifica che la data selezionata non sia nel passato
        const selectedDate = new Date(this.operationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Rimuove l'ora dalla data corrente
        if (selectedDate < today) {
          alert("La data deve essere futura!");
          return;
        }

        // Combinare la data e l'ora
        const formattedDate = this.combineDateAndTime(
          this.operationDate,
          this.operationTime
        );

        // Chiamata al backend per salvare l'operazione
        const response = await fetch("/api/operations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId,
            patientId: this.selectedPatientId,
            operationDate: formattedDate, // Invio la data + ora combinata
            description: this.description,
            createdAt: new Date().toISOString(), // Timestamp di creazione
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(
            error.message || "Errore durante la pianificazione dell'operazione."
          );
        }

        await response.json();
        alert("Operazione pianificata con successo!");

        // Mostra il calendario delle attività
        this.showActivityCalendar();

        // Chiudi il modal
        this.closeScheduleModal();
      } catch (error) {
        console.error(
          "Errore durante la pianificazione dell'operazione:",
          error
        );
        alert("Errore: " + error.message);
      }
    },

    parseISODate(isoString) {
      try {
        if (!isoString) {
          throw new Error("La stringa della data è undefined o vuota");
        }
        const date = new Date(isoString);
        if (isNaN(date)) {
          throw new Error("Formato della data non valido");
        }
        return date.toDateString(); // Restituisce una stringa coerente con dayDate
      } catch (error) {
        console.error(
          `DEBUG: Errore nella conversione della data ISO "${isoString}":`,
          error
        );
        return "Invalid Date";
      }
    },

    // Funzione per combinare la data e l'ora in un formato compatibile con Firebase (YYYY-MM-DDTHH:MM:SS)
    combineDateAndTime(date, time) {
      return `${date}T${time}:00`; // Combina la data e l'ora in formato corretto
    },

    // Funzione per ottenere la data minima per l'input (oggi)
    getMinDate() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = (today.getMonth() + 1).toString().padStart(2, "0");
      const dd = today.getDate().toString().padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },

    // Chiude il modal
    closeModal() {
      this.showModal = false;
    },

    // Mostra il calendario delle attività
    showActivityCalendar() {
      // Logica per visualizzare il calendario
      this.selectedDay = null; // Resetta la selezione del giorno
      this.loadPatients(); // Ricarica i pazienti per aggiornare il calendario
      alert("Calendario aggiornato!"); // Messaggio temporaneo
    },

    checkUserRole() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.role === "patient") {
        this.isPatient = true;
        this.patientId = userData.userId; // Recupera l'ID del paziente
        this.selectedPatient = userData; // Imposta il paziente selezionato

        // Carica le operazioni del paziente loggato
        this.loadPatientOperations();
      } else if (userData && userData.role === "doctor") {
        this.isDoctor = true;
        console.log("Ruolo utente: Dottore");
      }
    },

    // Modifica per caricare le radiografie dei pazienti
    async loadPatients() {
      const doctorId = localStorage.getItem("doctorId");
      if (doctorId) {
        try {
          const response = await fetch(`/api/${doctorId}/patients`);
          const data = await response.json();
          this.patients = data;

          // Carica le radiografie per ogni paziente
          this.patients.forEach((patient) => {
            this.loadRadiographs(patient.userId); // Carica le radiografie per ogni paziente
            this.loadOperations(patient.userId);
          });
        } catch (error) {
          console.error("Errore nel caricamento dei pazienti:", error);
        }
      }
    },

    async loadOperations(patientId) {
      try {
        const response = await fetch(`/api/patients/${patientId}/operations`);
        if (response.ok) {
          const data = await response.json();

          // Log delle operazioni trovate
          console.log(
            `Operazioni trovate per il paziente con ID ${patientId}:`,
            data
          );

          // Trova il paziente e aggiungi le operazioni al suo record
          const patient = this.patients.find((p) => p.userId === patientId);
          if (patient) {
            patient.operations = data; // Aggiungi le operazioni al paziente
          }
        } else {
          console.error("Errore nel recupero delle operazioni");
        }
      } catch (error) {
        console.error("Errore di connessione al server:", error);
      }
    },

    // Modifica per caricare le radiografie specifiche di un paziente
    async loadRadiographs(patientId) {
      try {
        const response = await fetch(`/api/patients/${patientId}/radiographs`);
        if (response.ok) {
          const data = await response.json();

          // Trova il paziente e aggiungi le radiografie al suo record
          const patient = this.patients.find((p) => p.userId === patientId);
          if (patient) {
            patient.radiographs = data; // Aggiungi le radiografie al paziente
          }
        } else {
          console.error("Errore nel recupero delle radiografie");
        }
      } catch (error) {
        console.error("Errore di connessione al server:", error);
      }
    },

    refreshCalendar() {
      this.$forceUpdate(); // Forza l'aggiornamento del componente
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
  font-size: 1em;
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

.activity-icons {
  display: flex;
  flex-direction: column; /* Cambia la direzione per impilare le righe */
  align-items: center;
  gap: 10px; /* Spazio tra righe */
  margin-top: 5px;
}

.icon-row {
  display: flex;
  justify-content: center;
  gap: 2px; /* Spazio tra le icone nella stessa riga */
}

.operations {
  margin-bottom: 5px; /* Aggiunge margine tra operazioni e radiografie */
}

.icon {
  width: 10px;
  height: 10px;
}

button {
  cursor: pointer;
  background: none;
  border: none;
  font-size: 0.7em;
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

/* Transizione Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
}

.modal-content label {
  display: block;
  margin-bottom: 10px;
  text-align: left;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>
