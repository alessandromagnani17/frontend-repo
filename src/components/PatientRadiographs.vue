<template>
  <div class="radiograph-list">
    <div class="line-container">
      <div class="line"></div>
    </div>
    <h2>Radiografie di {{ patientName }}</h2>
    <ul v-if="radiographs.length">
      <li
        v-for="radiograph in radiographs"
        :key="radiograph.name"
        class="radiograph-item"
      >
        <div>
          {{ radiograph.date }} -
          <button @click="toggleRadiograph(radiograph)" class="view-link">
            Visualizza
          </button>
        </div>

        <div
          v-if="selectedRadiograph === radiograph"
          class="radiograph-preview"
        >
          <div
            class="content-with-animation"
            :class="{ 'slide-down': isSlidingDown, 'slide-up': isSlidingUp }"
          >
            <img
              :src="radiograph.url"
              alt="Radiografia"
              class="radiograph-image"
              v-show="isImageVisible"
            />
          </div>
          <div class="radiograph-controls">
            <button
              @click="enlargeRadiograph(radiograph.url)"
              class="control-button"
            >
              <img src="@/assets/zoom.svg" alt="Zoom" class="icon" />
            </button>
            <a
              :href="`/api/download-radiograph?url=${encodeURIComponent(
                radiograph.url
              )}&filename=radiografia_${radiograph.date}.png`"
              class="control-button"
              download
            >
              <img src="@/assets/download.svg" alt="Download" class="icon" />
            </a>
          </div>
        </div>
      </li>
    </ul>
    <p v-else>Nessuna radiografia trovata per questo paziente.</p>

    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close-button">
          <img src="@/assets/cross.svg" alt="Chiudi" class="close-icon" />
        </span>
        <img
          :src="modalImageUrl"
          alt="Immagine ingrandita"
          class="modal-image"
        />
      </div>
    </div>

    <div v-if="errorMessage" class="error-alert">
      {{ errorMessage }}
      <button @click="errorMessage = ''" class="close-error">×</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PatientRadiographs",
  props: {
    patientId: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      radiographs: [],
      selectedRadiograph: null,
      isModalOpen: false,
      modalImageUrl: "",
      isImageVisible: false,
      isSlidingDown: false,
      isSlidingUp: false,
      errorMessage: "",
      currentPatientId: this.patientId, // Variabile locale per gestire il patientId
    };
  },
  async mounted() {
    await this.loadRadiographs(); // Carica le radiografie iniziali, se necessario
  },

  watch: {
    patientId(newPatientId) {
      this.currentPatientId = newPatientId; // Aggiorna la variabile locale quando cambia la prop
      this.loadRadiographs(); // Ricarica le radiografie quando la prop cambia
    },
  },

  methods: {
    async loadRadiographs() {
      try {
        console.log("Props patientId:", this.patientId);
        console.log("Props patientName:", this.patientName);

        const response = await fetch(
          `/api/patients/${this.currentPatientId}/radiographs`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("[DEBUG] Radiografie ricevute dal backend:", data);
          this.radiographs = data;
        } else {
          this.errorMessage = "Errore nel recupero delle radiografie.";
          console.error(
            "[ERROR] Errore nella risposta del server:",
            response.status
          );
        }
      } catch (error) {
        this.errorMessage = "Errore di connessione al server.";
        console.error(
          "[ERROR] Errore durante la connessione al server:",
          error
        );
      }
    },

    // Rimuovi la logica che cerca di modificare il patientId
    async selectPatient(patient) {
      this.selectedPatient = patient;
      this.currentPatientId = patient.userId; // Aggiorna la variabile locale
      this.radiographs = []; // Svuota le radiografie precedenti
      await this.loadRadiographs(); // Carica le radiografie del nuovo paziente
    },

    toggleRadiograph(radiograph) {
      if (this.selectedRadiograph === radiograph) {
        this.isSlidingDown = false;
        this.isSlidingUp = true;
        setTimeout(() => {
          this.isImageVisible = false;
          this.selectedRadiograph = null;
          this.isSlidingUp = false;
        }, 300);
      } else {
        this.selectedRadiograph = radiograph;
        this.isSlidingUp = false;
        this.isSlidingDown = true;
        this.isImageVisible = true;
      }
    },

    enlargeRadiograph(url) {
      this.modalImageUrl = url;
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
.error-alert {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336;
  color: white;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 14px;
}

.close-error {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.radiograph-list {
  max-width: 800px;
  margin: 20px auto;
}

.line-container {
  display: flex;
  align-items: center;
  margin: 2rem 0;
}

.line {
  width: 90%;
  height: 1px;
  background-color: #ccc;
  margin: 0 auto;
}

h2 {
  font-size: 18px;
  color: #333;
  margin-top: 30px;
  margin-bottom: 15px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li.radiograph-item {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  font-size: 12px;
  color: #444;
  display: flex;
  flex-direction: column;
}

.view-link {
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.5s ease;
  padding: 0;
  margin: 0;
}

.view-link:hover {
  color: #0056b3;
}

.radiograph-preview {
  margin-top: 15px;
  width: 95%;
  align-self: center;
}

.radiograph-image {
  width: 100%;
  display: block;
  margin-bottom: 10px;
}

.content-with-animation {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s ease-out, transform 0.5s ease-out;
  transform: translateY(-20px);
}

.content-with-animation.slide-down {
  max-height: 550px;
  transform: translateY(0);
}

.content-with-animation.slide-up {
  max-height: 0;
  transform: translateY(-20px);
}

.radiograph-controls {
  display: flex;
  justify-content: flex-end;
}

.control-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 10px;
}

.icon {
  width: 20px;
  height: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  width: auto;
  max-width: 90vmin; /* Adatta la dimensione al lato più piccolo del viewport */
  max-height: 90vmin; /* Stessa dimensione del contenitore dell'immagine */
  background: white;
  border-radius: 6px;
  padding: 0; /* Rimuove lo spazio interno */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image {
  height: auto; /* Calcola l'altezza automaticamente */
  width: 80vmin; /* Usa il lato minore tra altezza e larghezza della finestra */
  max-width: 100%; /* Non supera la larghezza disponibile */
  max-height: 100%; /* Non supera l'altezza disponibile */
  display: block;
  margin: 0 auto;
  object-fit: cover; /* Assicura il mantenimento delle proporzioni */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 16px;
  cursor: pointer;
}

.close-icon {
  width: 12px;
  height: 12px;
}
</style>
