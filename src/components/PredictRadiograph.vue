<template>
  <div class="welcome">
    <div class="container mt-5">
      <h5 v-if="showUploadSection"><strong>Carica una radiografia</strong></h5>
      <div v-if="isLoading" class="alert alert-info">Caricamento...</div>
      <div v-else>
        <div v-if="patients.length === 0" class="alert alert-warning">
          Non hai ancora nessun paziente associato.
        </div>
        <div v-else>
          <div class="select-container mb-4">
            <select
              v-if="patients.length > 0 && !selectedPatient"
              v-model="selectedPatient"
              @change="onPatientChange"
              class="form-select custom-select"
            >
              <option value="" disabled selected>Seleziona un paziente</option>
              <option
                v-for="patient in patients"
                :key="patient.userId"
                :value="patient.userId"
              >
                {{ patient.name }} {{ patient.family_name }} (ID:
                {{ patient.userId }})
              </option>
            </select>
          </div>
          <div v-if="selectedPatientName && showMainImagePreview" class="mt-2">
            <div>
              Utente selezionato: <strong>{{ selectedPatientName }}</strong>
            </div>
            <button @click="changePatient" class="btn btn-secondary mt-2">
              Cambia paziente
            </button>
          </div>
          <div><h5></h5></div>
          <div v-if="selectedPatient">
            <input
              v-if="showUploadSection"
              type="file"
              ref="fileInput"
              @change="onFileChange"
              accept="image/*"
              style="display: none"
            />
            <button
              v-if="showUploadSection"
              @click="selectFile"
              class="btn btn-secondary"
            >
              Seleziona file
            </button>
            <div
              v-if="imagePreview && selectedPatient && showMainImagePreview"
              class="mt-3"
            >
              <img
                :src="imagePreview"
                alt="Anteprima immagine"
                class="img-preview"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="!showMainImagePreview" class="mt-3">
        <h2 class="mb-4">Risultati della predizione</h2>
      </div>

      <div v-if="imagePreview && selectedPatient">
        <button
          v-if="showPredictButton"
          @click="submitImage"
          class="btn btn-primary mt-5"
        >
          Predici osteoartrite
        </button>
      </div>
      <div v-if="predictedClass !== null" class="mt-4">
        <div class="row">
          <div class="col-md-6 col-12">
            <div class="card">
              <img
                :src="imagePreview"
                class="card-img-top"
                alt="Anteprima immagine"
              />
              <div class="card-body">
                <h5 class="card-title">Radiografia Originale</h5>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12">
            <div class="card">
              <img
                :src="gradcamImage"
                class="card-img-top"
                alt="Grad-CAM Image"
              />
              <div class="card-body">
                <h5 class="card-title">Applicazione Grad-CAM</h5>
              </div>
            </div>
          </div>
        </div>
        <div class="card prediction-card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ predictedClass }}</h5>
          </div>
        </div>
        <div v-if="showNewPredictionButton" class="mt-4">
          <button @click="resetPrediction" class="btn btn-secondary">
            Esegui nuova predizione
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getPatientsFromDoctor } from "@/services/api-service";

export default {
  data() {
    return {
      selectedFile: null,
      selectedFileName: null,
      predictedClass: null,
      imagePreview: null,
      gradcamImage: null,
      showNewPredictionButton: false,
      showPredictButton: true,
      showUploadSection: true,
      patients: [],
      selectedPatient: "",
      selectedPatientName: "",
      isLoading: true,
      showMainImagePreview: true,
    };
  },
  async created() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userUid = userData.doctorID;
    this.patients = await getPatientsFromDoctor(userUid);
    this.isLoading = false;
  },
  methods: {
    resetPrediction() {
      this.selectedFile = null;
      this.selectedFileName = null;
      this.predictedClass = null;
      this.imagePreview = null;
      this.gradcamImage = null;
      this.showNewPredictionButton = false;
      this.showPredictButton = true;
      this.showUploadSection = true;
      this.showMainImagePreview = true;
      this.selectedPatient = "";
      this.selectedPatientName = "";
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    selectFile() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.imagePreview = URL.createObjectURL(this.selectedFile);
    },
    async submitImage() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      const userData = JSON.parse(localStorage.getItem("userData"));
      const userUid = userData.uid;
      formData.append("userUID", userUid);
      formData.append("selectedPatientID", this.selectedPatient);

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/predict",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Response from server:", response.data);
        this.predictedClass = response.data.predicted_class;
        this.gradcamImage = response.data.gradcam_image;
        this.showNewPredictionButton = true;
        this.showPredictButton = false;
        this.showUploadSection = false;
        this.showMainImagePreview = false;
      } catch (error) {
        console.error("Error predicting image:", error);
      }
    },
    onPatientChange() {
      const patient = this.patients.find(
        (p) => p.userId === this.selectedPatient
      );
      this.selectedPatientName = patient
        ? `${patient.name} ${patient.family_name} (ID: ${patient.userId})`
        : "";
      this.showPredictButton = true;
    },
    changePatient() {
      this.selectedPatient = "";
      this.selectedPatientName = "";
      this.selectedFile = null;
      this.selectedFileName = null;
      this.imagePreview = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
      this.showPredictButton = false;
      this.showUploadSection = true;
    },
  },
};
</script>

<style scoped>
.welcome {
  background: #ffffff; /* Sfondo bianco */
  min-height: 100vh;
  display: flex;
  align-items: center; /* Centra verticalmente */
  justify-content: center; /* Centra orizzontalmente */
}

.container {
  max-width: 90%; /* Modifica qui per utilizzare una percentuale */
  padding: 5%; /* Usa percentuali per il padding */
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  margin-top: 10%; /* Usa percentuali per il margine superiore */
  height: auto;
  text-align: center;
  flex-grow: 1;
}

.img-preview {
  max-width: 100%;
  max-height: 50vh; /* Modifica per utilizzare una percentuale dell'altezza della finestra */
  margin-top: 15px;
}

.row {
  display: flex; /* Usa Flexbox per le card */
  flex-wrap: wrap; /* Permetti alle card di andare a capo se necessario */
  margin-bottom: 20px; /* Margine inferiore per la separazione */
  height: 10%;
}

.card {
  flex: 1 1 45%; /* Permetti alle card di occupare il 45% della larghezza */
  margin: 10px; /* Margine tra le card */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Stili per la card della predizione */
.card.prediction-card {
  margin-top: 20px; /* Margine superiore per separarla dalle altre card */
}

.card-img-top {
  border-radius: 0.5rem;
  max-height: 50vh; /* Limita l'altezza in percentuale */
  object-fit: cover; /* Mantieni le proporzioni dell'immagine */
}

.card-body {
  text-align: center;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.sidebar {
  top: 0;
  width: 250px;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(180deg, #212529, #343a40);
  margin-right: 20px;
}

.sidebar .nav-link {
  color: #cfd2d6;
}

.sidebar .nav-link:hover {
  background-color: #495057;
  border-radius: 5px;
}

.nav-link {
  padding: 10px 15px;
}

@media (max-width: 767.98px) {
  .navbar-brand {
    font-size: 1.5rem;
  }

  .sidebar {
    display: none;
  }
}

.select-container {
  margin-top: 18px; /* Spazio sopra il menu a tendina */
  margin-bottom: 10px; /* Spazio sotto il menu a tendina */
}

.form-select {
  display: block; /* Assicurati che il selettore occupi l'intera larghezza */
  width: 100%; /* Fa sì che il selettore si espanda */
  padding: 10px; /* Padding interno per il selettore */
  border: 1px solid #ced4da; /* Colore del bordo */
  border-radius: 5px; /* Angoli arrotondati */
  background-color: #fff; /* Sfondo bianco */
  transition: border-color 0.2s; /* Transizione per il cambio del colore del bordo */
}

.form-select:focus {
  border-color: #007bff; /* Colore del bordo quando in focus */
  outline: none; /* Rimuove l'outline predefinito */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Ombra del box quando in focus */
}

.custom-select {
  max-width: 80%; /* Imposta la larghezza massima desiderata */
  margin: 0 auto; /* Centra il menu a tendina */
}
</style>
