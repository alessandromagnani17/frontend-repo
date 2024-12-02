<template>
  <div class="activity-calendar">
    <div class="calendar-container">
      <h1 class="calendar">Calendario Attività</h1>

      <!-- Verifica se l'utente è un paziente o un dottore -->
      <div v-if="isPatient">
        <div class="calendar">
          <div class="calendar-header">
            <button @click="changeMonth(-1)">&#8249;</button>
            <span>{{ monthNames[month] }} {{ year }}</span>
            <button @click="changeMonth(1)">&#8250;</button>
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

        <!-- Dettagli del giorno selezionato con animazione -->
        <transition
          name="fade"
          @before-enter="beforeEnter"
          @enter="enter"
          @leave="leave"
        >
          <div v-if="selectedDay" class="day-details">
            <h2>
              Dettagli del Giorno: {{ selectedDay.date }}
              {{ monthNames[month] }}
              {{ year }}
            </h2>
            <div v-if="selectedDay.operations.length > 0">
              <h3>Operazioni pianificate:</h3>
              <ul>
                <li
                  v-for="operation in selectedDay.operations"
                  :key="operation.id"
                >
                  <strong>{{ operation.type }}</strong
                  ><br />
                  <span>{{ operation.date }}</span
                  ><br />
                  <span>{{ operation.description }}</span
                  ><br />
                </li>
              </ul>
            </div>
            <div v-else>
              <p>Nessuna operazione pianificata per questa data.</p>
            </div>
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
          <div class="calendar">
            <div class="calendar-header">
              <button @click="changeMonth(-1)">&#8249;</button>
              <span>{{ monthNames[month] }} {{ year }}</span>
              <button @click="changeMonth(1)">&#8250;</button>
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
                      `${day.year}-${String(day.month).padStart(
                        2,
                        '0'
                      )}-${String(day.date).padStart(2, '0')}` === minDate,
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
              Dettagli del Giorno: {{ selectedDay.date }}
              {{ monthNames[month] }}
              {{ year }}
            </h2>
            <!-- Operazioni -->
            <div v-if="selectedDay.operations.length > 0">
              <h1 class="calendar">Operazioni pianificate:</h1>
              <div
                v-for="operation in selectedDay.operations"
                :key="operation.id"
              >
                <p>
                  <strong>{{ operation.patientName }}:</strong>
                  {{ operation.name }}
                </p>
                <span>{{ operation.operationDate }}</span
                ><br />
                <span>{{ operation.description }}</span
                ><br />
              </div>
            </div>
            <div v-else>
              <p>Nessuna operazione pianificata per questa data.</p>
            </div>
            <!-- Radiografie -->
            <div v-if="selectedDay.radiographs.length > 0">
              <h1 class="calendar">Radiografie caricate:</h1>

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
            <div v-else>
              <p>Nessuna radiografia caricata in questa data.</p>
            </div>
          </div>
        </transition>
      </div>
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
      dayNames: ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"],
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
    this.checkUserRole(); // Verifica il ruolo dell'utente
    if (this.isDoctor) {
      this.loadPatients(); // Carica i pazienti del dottore
    }
    if (this.isPatient) {
      const userData = JSON.parse(localStorage.getItem("userData")); // Decodifica il JSON
      if (userData && userData.userId) {
        const userId = userData.userId; // Recupera lo userId
        console.log("User ID recuperato:", userId);
        this.loadPatientData(userId); // Carica operazioni e radiografie per il paziente
      } else {
        console.error("User ID non trovato in userData.");
      }
    }
  },
  computed: {
    daysInMonth() {
      const days = [];
      const lastDayOfMonth = new Date(this.year, this.month + 1, 0);
      const totalDays = lastDayOfMonth.getDate();
      const firstDayOfMonth = new Date(this.year, this.month, 1);
      const startDayOfWeek = firstDayOfMonth.getDay(); // Giorno della settimana (0 = Domenica, 1 = Lunedì, ecc.)

      // Calcola quanti giorni del mese precedente devono essere inclusi
      const daysFromPrevMonth = (startDayOfWeek + 6) % 7; // Se il mese inizia di lunedì, vogliamo 0 giorni precedenti
      const prevMonthLastDay = new Date(this.year, this.month, 0).getDate();

      // Radiografie e operazioni per ogni giorno
      const radiographsPerDay = {};
      const operationsPerDay = {};

      // Se l'utente è un medico
      if (this.isDoctor) {
        this.patients.forEach((patient) => {
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

          if (patient.operations) {
            patient.operations.forEach((operation) => {
              const operationDate = this.parseISODate(operation.operationDate);
              if (operationDate !== "Invalid Date") {
                if (!operationsPerDay[operationDate]) {
                  operationsPerDay[operationDate] = [];
                }
                operationsPerDay[operationDate].push({
                  ...operation,
                  patientName: `${patient.name} ${patient.family_name}`,
                });
              }
            });
          }
        });
      } else {
        const userData = JSON.parse(localStorage.getItem("userData")); // Decodifica il JSON

        if (this.radiographs) {
          this.radiographs.forEach((radiograph) => {
            const radiographDate = new Date(radiograph.date).toDateString(); // Data della radiografia
            if (!radiographsPerDay[radiographDate]) {
              radiographsPerDay[radiographDate] = []; // Inizializza se non esiste
            }
            radiographsPerDay[radiographDate].push({
              ...radiograph,
              patientName: `${userData.name} ${userData.family_name}`,
            }); // Aggiungi radiografia alla data
          });
        }

        if (this.operations) {
          this.operations.forEach((operation) => {
            const operationDate = this.parseISODate(operation.operationDate); // Data dell'operazione
            if (operationDate !== "Invalid Date") {
              if (!operationsPerDay[operationDate]) {
                operationsPerDay[operationDate] = []; // Inizializza se non esiste
              }
              operationsPerDay[operationDate].push({
                ...operation,
                patientName: `${userData.name} ${userData.family_name}`,
              }); // Aggiungi operazione alla data
            }
          });
        }
      }

      // Aggiungi i giorni del mese precedente
      for (let i = daysFromPrevMonth; i > 0; i--) {
        const date = new Date(
          this.year,
          this.month - 1,
          prevMonthLastDay - i + 1
        );
        const dayString = date.toDateString();
        const radiographsOnDay = radiographsPerDay[dayString] || [];
        const operationsOnDay = operationsPerDay[dayString] || [];
        days.push({
          date: date.getDate(),
          year: date.getFullYear(), // Aggiungi l'anno
          month: date.getMonth(), // Aggiungi il mese (0 = Gennaio, 11 = Dicembre)
          radiographs: radiographsOnDay,
          operations: operationsOnDay,
          isDisabled: true, // Per i giorni del mese precedente
        });
      }

      // Aggiungi i giorni del mese corrente
      for (let i = 1; i <= totalDays; i++) {
        const date = new Date(this.year, this.month, i);
        const dayString = date.toDateString();
        const radiographsOnDay = radiographsPerDay[dayString] || [];
        const operationsOnDay = operationsPerDay[dayString] || [];
        days.push({
          date: i,
          year: date.getFullYear(), // Aggiungi l'anno
          month: date.getMonth() + 1, // Aggiungi il mese (0 = Gennaio, 11 = Dicembre)
          radiographs: radiographsOnDay,
          operations: operationsOnDay,
          isDisabled: false, // Per i giorni del mese corrente
        });
      }

      // Calcola quanti giorni del mese successivo devono essere inclusi
      const remainingDays = 42 - days.length; // Un calendario completo ha 6 settimane = 42 giorni
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(this.year, this.month + 1, i);
        const dayString = date.toDateString();
        const radiographsOnDay = radiographsPerDay[dayString] || [];
        const operationsOnDay = operationsPerDay[dayString] || [];
        days.push({
          date: i,
          year: date.getFullYear(), // Aggiungi l'anno
          month: date.getMonth() + 1, // Aggiungi il mese (0 = Gennaio, 11 = Dicembre)
          radiographs: radiographsOnDay,
          operations: operationsOnDay,
          isDisabled: true, // Per i giorni del mese successivo
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
        console.log("Ruolo utente: Paziente");
      } else if (userData && userData.role === "doctor") {
        this.isDoctor = true;
        console.log("Ruolo utente: Dottore");
      }
    },
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

    // Modifica per caricare i pazienti (solo per i medici)
    async loadPatients() {
      const doctorId = localStorage.getItem("doctorId");
      if (doctorId) {
        try {
          const response = await fetch(`/api/${doctorId}/patients`);
          const data = await response.json();
          this.patients = data;

          // Carica le radiografie e le operazioni per ogni paziente
          this.patients.forEach((patient) => {
            this.loadPatientData(patient.userId); // Carica i dati per ogni paziente
          });
        } catch (error) {
          console.error("Errore nel caricamento dei pazienti:", error);
        }
      }
    },

    // Funzione generica per caricare le operazioni e le radiografie
    async loadPatientData(patientId) {
      try {
        console.log("PATIENTIDNJNDEJINCJDJ: ", patientId);
        // Carica le operazioni
        const operationsResponse = await fetch(
          `/api/patients/${patientId}/operations`
        );
        if (operationsResponse.ok) {
          const operationsData = await operationsResponse.json();
          console.log("RADIOGRNJCNEJCD: ", operationsData);
          this.handleLoadedData("operations", patientId, operationsData);
        } else {
          console.error("Errore nel recupero delle operazioni");
        }

        // Carica le radiografie
        const radiographsResponse = await fetch(
          `/api/patients/${patientId}/radiographs`
        );
        if (radiographsResponse.ok) {
          const radiographsData = await radiographsResponse.json();
          this.handleLoadedData("radiographs", patientId, radiographsData);
        } else {
          console.error("Errore nel recupero delle radiografie");
        }
      } catch (error) {
        console.error("Errore di connessione al server:", error);
      }
    },

    // Funzione per gestire i dati caricati (operazioni o radiografie)
    handleLoadedData(type, patientId, data) {
      // Se l'utente è un medico, aggiorna la lista dei pazienti
      if (this.isDoctor) {
        const patient = this.patients.find((p) => p.userId === patientId);
        if (patient) {
          patient[type] = data; // Aggiungi le operazioni o radiografie al paziente
          console.log(
            `${
              type.charAt(0).toUpperCase() + type.slice(1)
            } aggiunti al paziente:`,
            patient[type]
          );
        }
      } else {
        // Se l'utente è un paziente, aggiorna direttamente il proprio profilo
        this[type] = data; // Aggiungi le operazioni o radiografie al profilo del paziente
        console.log(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } aggiunti al profilo del paziente:`,
          this[type]
        );
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
.calendar-calendar {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.calendar-container {
  max-width: 100%;
  padding: 40px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

h1.calendar {
  font-size: 18px; /* Stessa dimensione del testo di "Elenco Pazienti" */
  font-family: inherit; /* Assicura che usi lo stesso font ereditato dal contesto */
  font-weight: normal; /* Mantenere il peso del font uguale */
  margin-bottom: 20px; /* Margine inferiore uguale per allineamento */
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
  height: 70px;
  overflow: hidden;
  cursor: pointer;
}

/* Giorni disabilitati (mese precedente e successivo) */
.calendar-day.disabled {
  opacity: 0.5;
  color: #ccc; /* Testo grigio chiaro */
  pointer-events: none; /* Non cliccabili */
  background-color: #f9f9f9; /* Sfondo leggermente diverso, opzionale */
}

/* Puoi anche aggiungere un bordo per evidenziare meglio i giorni */
.calendar-day.disabled:hover {
  border: 1px dashed #ddd; /* Aggiunge un bordo hover sui giorni disabilitati */
}

.calendar-day.today {
  border: 2px solid #fc2424db; /* Bordo rosso per il giorno corrente */
  border-radius: 5px; /* Bordo arrotondato (opzionale) */
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

.date {
  font-size: 1em;
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
  min-height: 7px;
  margin-bottom: 3px; /* Aggiunge margine tra operazioni e radiografie */
}

.icon {
  width: 7px;
  height: 7px;
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
