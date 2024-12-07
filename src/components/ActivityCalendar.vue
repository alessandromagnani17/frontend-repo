<template>
  <div class="activity-calendar">
    <div class="calendar-container">
      <h1 class="calendar">Calendario Attività</h1>

      <!-- Calendario per utente (paziente o dottore) -->
      <Calendar
        :month="month"
        :year="year"
        :daysInMonth="daysInMonth"
        :monthNames="monthNames"
        :dayNames="dayNames"
        :minDate="minDate"
        :operationIcon="operationIcon"
        :radiographIcon="radiographIcon"
        :showDayDetails="showDayDetails"
        :changeMonth="changeMonth"
        :selectedDay="selectedDay"
        @update-selected-day="updateSelectedDay"
      />

      <!-- Dettagli del giorno selezionato -->
      <transition
        name="fade"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <DayDetails
          v-if="selectedDay"
          :selectedDay="selectedDay"
          :monthNames="monthNames"
          :month="month"
          :year="year"
          :formatDate="formatDate"
          :formatTime="formatTime"
          :enlargeRadiograph="enlargeRadiograph"
        />
      </transition>

      <!-- Modale per pianificare l'operazione (solo per dottore) -->
      <div v-if="isDoctor">
        <button @click="openScheduleModal" class="btn btn-primary custom-btn">
          Pianifica Operazione
        </button>

        <!-- Modale per inserire i dettagli dell'operazione -->
        <div v-if="showModal" class="modal">
          <div class="modal-content">
            <h2>Pianifica una nuova operazione</h2>
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

            <div>
              <button @click="scheduleOperation" class="btn btn-success">
                Salva
              </button>
              <button @click="closeScheduleModal" class="btn btn-secondary">
                Annulla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from "./ScheduleCalendar.vue";
import DayDetails from "./DayDetails.vue";

export default {
  components: {
    Calendar,
    DayDetails,
  },
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

          // Aggiungi le operazioni per ogni paziente
          if (patient.operations) {
            patient.operations.forEach((operation) => {
              const operationDate = this.parseISODate(operation.operationDate);
              if (operationDate !== "Invalid Date") {
                if (!operationsPerDay[operationDate]) {
                  operationsPerDay[operationDate] = [];
                }
                operationsPerDay[operationDate].push({
                  ...operation,
                  patientName: `${patient.name} ${patient.family_name}`, // Include il nome del paziente
                });
              }
            });
          }
        });
      } else {
        // Se l'utente è un paziente, carica solo le proprie operazioni e radiografie
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
            const operationDate = this.parseISODate(operation.operationDate);
            if (operationDate !== "Invalid Date") {
              if (!operationsPerDay[operationDate]) {
                operationsPerDay[operationDate] = [];
              }
              operationsPerDay[operationDate].push({
                ...operation,
                patientName:
                  operation.patientName ||
                  `${this.userName} ${this.userFamilyName}`, // Include il nome del paziente
              });
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
    updateSelectedDay(day) {
      this.selectedDay = day;
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

        // Dopo che l'operazione è stata pianificata, invia una notifica al paziente
        await this.sendNotificationToPatient();

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

    // Aggiungi questa funzione per inviare la notifica
    async sendNotificationToPatient() {
      try {
        if (!this.operationDate || !this.operationTime || !this.description) {
          alert(
            "Assicurati di aver inserito tutti i dettagli dell'operazione."
          );
          return;
        }

        // Estrae solo la parte dell'ora e dei minuti per `time`
        const notificationTime = this.operationTime; // Già in formato HH:mm

        // Crea il messaggio della notifica usando le informazioni dell'operazione
        const notificationMessage = `Una nuova operazione è stata pianificata per te!`;

        // Aggiunge la data e ora di invio della notifica
        const sentAt = new Date().toISOString(); // Data e ora corrente in formato ISO 8601

        // Chiamata al backend per inviare la notifica al paziente selezionato
        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patientId: this.selectedPatientId,
            message: notificationMessage,
            date: this.operationDate,
            time: notificationTime,
            sentAt, // Aggiunge l'attributo sentAt alla richiesta
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Errore nell'invio della notifica.");
        }

        alert("Notifica inviata al paziente.");
      } catch (error) {
        console.error("Errore nell'invio della notifica:", error);
        alert("Errore nell'invio della notifica.");
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
    },

    // Modifica per caricare i pazienti (solo per i medici)
    async loadPatients() {
      const doctorId = localStorage.getItem("doctorId");
      if (doctorId) {
        try {
          const response = await fetch(`/api/${doctorId}/patients`);
          const data = await response.json();
          this.patients = data;

          // Carica i dati di tutti i pazienti in batch
          await this.loadAllPatientData();
        } catch (error) {
          console.error("Errore nel caricamento dei pazienti:", error);
        }
      }
    },

    // Nuovo metodo per caricare i dati in batch
    async loadAllPatientData() {
      const batchPromises = this.patients.map((patient) =>
        this.loadPatientData(patient.userId)
      );

      // Usa Promise.allSettled per evitare errori bloccanti
      const results = await Promise.allSettled(batchPromises);

      // Log dei risultati per il debug
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          console.log(
            `Dati caricati per paziente ${this.patients[index].userId}`
          );
        } else {
          console.error(
            `Errore nel caricamento dei dati per paziente ${this.patients[index].userId}:`,
            result.reason
          );
        }
      });
    },

    // Funzione generica per caricare le operazioni e le radiografie
    async loadPatientData(patientId) {
      try {
        // Carica le operazioni e le radiografie in parallelo
        console.log("PAATIENTINDU: ", patientId);
        const [operationsResponse, radiographsResponse, patientResponse] =
          await Promise.all([
            fetch(`/api/patients/${patientId}/operations`),
            fetch(`/api/patients/${patientId}/radiographs`),
            fetch(`/api/get_user/${patientId}`), // Nuova chiamata per recuperare i dettagli del paziente
          ]);

        // Controlla se tutte le risposte sono valide
        if (operationsResponse.ok) {
          const operationsData = await operationsResponse.json();

          // Recupera il nome e il cognome del paziente
          if (patientResponse.ok) {
            const patientData = await patientResponse.json();
            operationsData.forEach((operation) => {
              operation.patientName = `${patientData.name} ${patientData.family_name}`;
            });
          }

          console.log("Operazioni: ", operationsData);
          this.handleLoadedData("operations", patientId, operationsData);
        } else {
          console.error("Errore nel recupero delle operazioni");
        }

        if (radiographsResponse.ok) {
          const radiographsData = await radiographsResponse.json();
          console.log("Radiografie: ", radiographsData);
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

    formatDate(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleDateString("it-IT"); // Mostra solo la data in formato italiano
    },
    formatTime(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }); // Mostra solo l'ora in formato 24 ore
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
.calendar-container {
  max-width: 100%;
  padding: 40px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

h1.calendar {
  font-size: 18px;
  font-family: inherit;
  font-weight: normal;
  margin-bottom: 20px;
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
  z-index: 999;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 500px; /* Aumentiamo la larghezza del modale */
  text-align: left;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  font-size: 1.2em; /* Aumentiamo leggermente il font per il titolo */
  margin-bottom: 15px;
  color: #333;
  font-weight: bold;
}

.modal-content label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 600;
  font-size: 0.85em; /* Ridotto per le etichette */
}

.modal-content select,
.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 4px 8px; /* Ridotto ulteriormente il padding dei campi */
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 4px; /* Border-radius più sottile */
  font-size: 0.75em; /* Ridotto ulteriormente la dimensione del font */
  box-sizing: border-box;
  transition: border 0.3s ease;
}

.modal-content select:focus,
.modal-content input:focus,
.modal-content textarea:focus {
  border-color: #007bff;
  outline: none;
}

.modal-content textarea {
  resize: vertical;
  height: 60px; /* Ancora più piccola la textarea */
}

.modal-content button {
  padding: 6px 12px; /* Ridotto il padding dei pulsanti */
  border-radius: 4px;
  border: none;
  font-size: 12px; /* Ridotto ulteriormente la dimensione dei pulsanti */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  margin-right: 6px;
}

.modal-content .btn-success {
  background-color: #28a745;
  color: white;
}

.modal-content .btn-success:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.modal-content .btn-secondary {
  background-color: #6c757d;
  color: white;
}

.modal-content .btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
}

.modal-content .btn {
  min-width: 90px; /* Ridotto il minimo larghezza dei pulsanti */
}

.modal-content .btn:focus {
  outline: none;
}

button {
  cursor: pointer;
  background: none;
  border: none;
  color: #007bff;
  font-size: 0.7em;
}

button:hover {
  color: #007bff;
}

.custom-btn {
  display: block; /* Imposta il pulsante come blocco per permettere il centramento */
  margin: 20px auto; /* Centra il pulsante e aggiungi un margine superiore di 20px */
  background-color: #007bff; /* Colore di sfondo */
  color: white; /* Colore del testo */
  border-radius: 5px; /* Raggio dei bordi per renderlo arrotondato */
  padding: 6px 12px; /* Ridotto il padding per rendere il pulsante più piccolo */
  text-align: center; /* Allinea il testo al centro */
  font-size: 14px; /* Dimensione del font più piccola */
  max-width: 200px; /* Limita la larghezza massima del pulsante */
  width: 100%; /* Permette di ridimensionare il pulsante in base alla larghezza del contenitore */
}

.custom-btn:hover {
  background-color: #0056b3; /* Colore di hover per effetto */
  color: white;
  cursor: pointer; /* Cambia il cursore su hover */
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
