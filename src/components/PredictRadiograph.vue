<template>
  <div class="welcome">
    <div class="container mt-5">
      <h5 v-if="showUploadSection" class="carica-radiografia">
        <strong>Carica una radiografia</strong>
      </h5>
      <div v-if="isLoading" class="alert alert-info small-text">
        Caricamento...
      </div>
      <div v-else>
        <div
          v-if="patients.length === 0"
          class="alert alert-warning small-text"
        >
          Non hai ancora nessun paziente associato.
        </div>
        <div v-else>
          <div class="select-container mb-4">
            <select
              v-if="patients.length > 0 && !selectedPatient"
              v-model="selectedPatient"
              @change="onPatientChange"
              class="form-select custom-select small-text"
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
          <div
            v-if="selectedPatientInfo.name.length > 0 && showMainImagePreview"
            class="mt-2"
          >
            <div class="patient-info-container small-text">
              <span>
                Utente selezionato:
                <strong>
                  {{ selectedPatientInfo.name }}
                  {{ selectedPatientInfo.surname }} <br />
                </strong>
                (ID: {{ selectedPatientInfo.userId }})
              </span>
              <!-- Pulsante Cambia -->
              <span class="change-text" @click="changePatient">Cambia</span>
            </div>
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
              class="btn-upload"
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
            <div v-if="showKneeSide" class="button-cover">
              <div
                class="buttonSide r"
                id="button-1"
                :class="{ active: selectedSide, inactive: !selectedSide }"
              >
                <input
                  type="checkbox"
                  v-model="selectedSide"
                  @change="updateSelectedSide"
                  class="checkbox"
                />
                <div class="knobs"></div>
                <div class="layer"></div>
              </div>
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
          class="btn-upload mt-5"
        >
          Predici osteoartrite
        </button>
      </div>
      <div v-if="predictedClass !== null" class="mt-4">
        <div class="card prediction-card mb-3">
          <div class="card-body">
            <h5 class="card-title small-text">
              Utente: {{ selectedPatientInfo.name }}
              {{ selectedPatientInfo.surname }} <br />
              (ID: {{ selectedPatientInfo.userId }})
            </h5>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-12">
            <div class="card">
              <img
                :src="imagePreview"
                class="card-img-top"
                alt="Anteprima immagine"
              />
              <div class="card-body">
                <h5 class="card-title small-text">Radiografia Originale</h5>
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
                <h5 class="card-title small-text">Applicazione Grad-CAM</h5>
              </div>
            </div>
          </div>
        </div>
        <div class="card prediction-card mb-3">
          <div class="card-body">
            <h5 class="card-title small-text">
              {{ predictedClass }} ({{
                selectedSide ? "Ginocchio destro" : "Ginocchio sinistro"
              }})
            </h5>
          </div>
        </div>
        <div v-if="showNewPredictionButton" class="mt-4">
          <button @click="resetPrediction" class="btn-upload">
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
      selectedPatientInfo: { name: "", surname: "", userId: "" },
      isLoading: true,
      showMainImagePreview: true,
      selectedSide: false, // False = Left ||| True = Right
      showKneeSide: false,
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
      this.selectedPatientInfo = { name: "", surname: "", userId: "" };
      this.showKneeSide = false;
      this.selectedSide = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
    },
    setSide(side) {
      this.selectedSide = side;
    },
    selectFile() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      this.showKneeSide = true;
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile.name;
      this.imagePreview = URL.createObjectURL(this.selectedFile);
    },
    async submitImage() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      const userData = JSON.parse(localStorage.getItem("userData"));
      formData.append("userData", JSON.stringify(userData));
      formData.append("selectedPatientID", this.selectedPatient);
      if (this.selectedSide) {
        formData.append("selectedSide", "Right");
      } else {
        formData.append("selectedSide", "Left");
      }

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
        this.showKneeSide = false;
      } catch (error) {
        console.error("Error predicting image:", error);
      }
    },
    onPatientChange() {
      const patient = this.patients.find(
        (p) => p.userId === this.selectedPatient
      );
      this.selectedPatientInfo = patient
        ? {
            name: patient.name,
            surname: patient.family_name,
            userId: patient.userId,
          }
        : { name: "", surname: "", userId: "" }; // Se non trovato, resetta a valori vuoti

      this.showPredictButton = true;
      this.showKneeSide = false;
    },
    changePatient() {
      this.selectedPatient = "";
      this.selectedPatientInfo = { name: "", surname: "", userId: "" };
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
  max-width: 80%;
  padding: 5%;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  margin-top: 10%;
  height: auto;
  text-align: center;
  flex-grow: 1;
}

.img-preview {
  max-width: 100%;
  max-height: 50vh;
  margin-top: 15px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  height: 10%;
}

.card {
  flex: 1 1 45%;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  border-radius: 0.5rem;
  max-height: 50vh;
  object-fit: cover;
}

.card-body {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.patient-info-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3vw;
  width: 100%;
}

.change-text {
  font-size: 14px;
  color: black;
  text-decoration: underline;
  cursor: pointer;
}

.btn-upload {
  background-color: #007bff;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 40%;
  min-width: 150px;
  font-size: 13px;
  transition: background-color 0.3s ease;
  text-align: center;
  margin-top: 10px;
}

.btn-upload:hover {
  background-color: #0056b3;
}

.small-text {
  font-size: 13px;
}

.select-container {
  margin-top: 18px;
  margin-bottom: 10px;
}

.form-select {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  background-color: #fff;
  transition: border-color 0.2s;
}

.form-select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.custom-select {
  max-width: 80%;
  margin: 0 auto;
}

.button-cover {
  height: 85%;
  width: 40%; /* Puoi regolare la larghezza come desideri */
  margin: 20px auto; /* Centrato orizzontalmente */
  background-color: #fff;
  display: block; /* Non usare flexbox qui, ma blocco per evitare allineamenti strani */
}

.buttonSide {
  position: relative;
  top: 50%;
  width: 100%; /* Mantieni la larghezza al 100% del contenitore */
  height: 36px;
  margin: 0 auto; /* Questo forza il centramento orizzontale */
  overflow: hidden;
}

.checkbox {
  position: relative;
  width: 100%; /* Imposta la larghezza del checkbox a 100% */
  height: 100%;
  padding: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

.knobs {
  z-index: 2;
}

.layer {
  width: 100%;
  background-color: #ebf7fc;
  transition: 0.3s ease all;
  z-index: 1;
}

#button-1 {
  position: relative;
  width: 100%;
  height: 36px;
  margin: 0 auto;
  overflow: hidden;
}

#button-1 .checkbox {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
}

#button-1 .knobs:before,
#button-1 .knobs:after {
  position: absolute;
  top: 4px;
  width: 60%;
  height: 30px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 9px 4px;
  border-radius: 5px;
  transition: 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15) all, opacity 0.3s ease,
    z-index 0.3s ease;
}

#button-1 .knobs:before {
  content: "Left";
  left: 4px;
  background-color: #03a9f4;
  opacity: 1;
  z-index: 2; /* Priorità inferiore di default */
}

#button-1 .knobs:after {
  content: "Right";
  left: 95px;
  background-color: #f44336;
  opacity: 0.5;
  z-index: 1; /* Priorità inferiore di default */
}

#button-1 .checkbox:checked + .knobs:before {
  left: 95px;
  opacity: 0.5;
  z-index: 1; /* L'elemento sbiadito va sotto */
}

#button-1 .checkbox:checked + .knobs:after {
  left: 4px;
  opacity: 1;
  z-index: 2; /* L'elemento visibile va sopra */
}

#button-1 .layer {
  width: 100%;
  background-color: #ebf7fc;
  transition: background-color 0.3s ease;
}

#button-1 .checkbox:checked ~ .layer {
  background-color: #fcebeb;
}

h5.carica-radiografia {
  font-size: 18px; /* Stessa dimensione del testo di "Elenco Pazienti" */
  font-family: inherit; /* Assicura che usi lo stesso font ereditato dal contesto */
  font-weight: normal; /* Mantenere il peso del font uguale */
  margin-bottom: 20px; /* Margine inferiore uguale per allineamento */
}

.btn-change-patient {
  background: #d9d9d9; /* Colore grigio chiaro */
  color: black; /* Colore del testo */
  width: 40%; /* Larghezza al 100% */
  margin-top: 15px; /* Spazio sopra il pulsante */
  padding: 0.4rem; /* Ridotto per i pulsanti, più corto verticalmente */
  font-size: 13px; /* Dimensione del testo più piccola */
  border: none; /* Nessun bordo */
  border-radius: 5px; /* Angoli arrotondati */
  cursor: pointer; /* Puntatore del mouse per il clic */
  transition: background-color 0.3s ease; /* Transizione al passaggio del mouse */
}

.btn-change-patient:hover {
  background-color: #bfbfbf; /* Colore grigio più scuro al passaggio del mouse */
}
</style>
