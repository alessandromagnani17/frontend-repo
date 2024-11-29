<template>
  <div class="welcome">
    <div class="container mt-5">
      <h1 v-if="showUploadSection" class="carica-radiografia">
        Carica una radiografia
      </h1>
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
              class="btn btn-light btn-select"
            >
              Seleziona file
            </button>
            <div
              v-if="imagePreview && selectedPatient && showMainImagePreview"
              class="mt-3 img-preview-container"
            >
              <img
                :src="imagePreview"
                alt="Anteprima immagine"
                class="img-preview"
              />
            </div>
            <div v-if="showKneeSide" class="button-cover">
              <div v-if="loadingPredict" class="loading-overlay"></div>

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
        <h1>Risultati della predizione</h1>
      </div>

      <div v-if="imagePreview && selectedPatient">
        <button
          v-if="showPredictButton"
          @click="submitImage"
          class="btn-upload"
          :disabled="loadingPredict"
        >
          <span v-if="loadingPredict">Caricamento...</span>
          <span v-else>Predici osteoartrite</span>
        </button>
      </div>

      <!-- Loading overlay per predizione -->
      <div v-if="loadingPredict" class="loading-overlay">
        <div class="loading-icon">
          <img src="@/assets/loading-icon.svg" alt="Loading..." />
        </div>
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
            <!-- Mostra il messaggio completo -->
            <h5 class="card-title small-text">
              {{ predictedClassMessage }} ({{
                selectedSide ? "Ginocchio destro" : "Ginocchio sinistro"
              }})
            </h5>
            <!-- Mostra la scritta in rosso se il grado è 4 o 5 -->
            <p
              v-if="predictedClass === 4 || predictedClass === 5"
              class="text-danger"
            >
              È necessaria un’operazione protesica per il paziente.
            </p>
          </div>
        </div>

        <div class="line-container">
          <div class="line"></div>
        </div>
        <div class="mt-3">
          <h5>Valuta la predizione</h5>
        </div>

        <!-- Stelle -->
        <transition name="fade-out-stars" @after-leave="showThankYou">
          <div class="stars" v-if="!starsHidden">
            <img
              v-for="index in 5"
              :key="index"
              :src="getStarImage(index)"
              @click="handleStarClick(index)"
              alt="Star"
              class="star"
            />
          </div>
        </transition>
        <!-- Messaggio di ringraziamento -->
        <transition name="fade-in-thank-you">
          <div v-if="showThankYouMessage" class="small-text mt-2">
            Grazie per la recensione!
          </div>
        </transition>
        <div
          v-if="showNewPredictionButton"
          class="mt-4 d-flex flex-column flex-md-row justify-content-center align-items-center gap-2"
        >
          <button
            @click="resetPrediction"
            class="btn btn-light btn-new-prediction"
          >
            Esegui nuova predizione
          </button>
          <!-- Pulsante Pianifica Operazione -->
          <button
            @click="goToActivityCalendar"
            class="btn btn-primary btn-upload"
          >
            Pianifica Operazione
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
      selectedRating: 0,
      starEmpty: require("@/assets/star-empty.svg"),
      starFilled: require("@/assets/star-filled.svg"),
      showThankYouMessage: false,
      starsHidden: false,
      loadingPredict: false,
    };
  },
  async created() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userUid = userData.doctorID;
    this.patients = await getPatientsFromDoctor(userUid);
    this.isLoading = false;
  },
  methods: {
    goToActivityCalendar() {
      this.$router.push("/activity-calendar"); // Reindirizza alla pagina del calendario
    },
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
      this.showThankYouMessage = false; // Nascondi il messaggio di ringraziamento
      this.starsHidden = false; // Mostra di nuovo le stelline
      this.selectedRating = 0; // Reimposta il rating selezionato
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

      this.loadingPredict = true; // Avvia il caricamento
      const formData = new FormData();
      formData.append("file", this.selectedFile);

      const userData = JSON.parse(localStorage.getItem("userData"));
      formData.append("userData", JSON.stringify(userData));
      formData.append("selectedPatientID", this.selectedPatient);
      formData.append("selectedSide", this.selectedSide ? "Right" : "Left");

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

        this.predictedClassMessage = response.data.predicted_class;

        // Estrazione numero dal messaggio
        const classMatch = this.predictedClassMessage.match(/\d+/);
        this.predictedClass = classMatch ? parseInt(classMatch[0], 10) : null;

        console.log("Predicted Class (number):", this.predictedClass);
        console.log("Predicted Class (message):", this.predictedClassMessage);

        this.gradcamImage = response.data.gradcam_image;
        this.showNewPredictionButton = true;
        this.showPredictButton = false;
        this.showUploadSection = false;
        this.showMainImagePreview = false;
        this.showKneeSide = false;
      } catch (error) {
        console.error("Error predicting image:", error);
      } finally {
        this.loadingPredict = false; // Ferma il caricamento
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
    handleStarClick(index) {
      this.selectedRating = index; // Imposta il rating selezionato

      if (index === 5) {
        // Carica la radiografia nella cartella "dataset"
        const formData = new FormData();
        formData.append("file", this.selectedFile);
        formData.append("patientID", this.selectedPatient);
        formData.append("side", this.selectedSide ? "Right" : "Left");

        axios
          .post("http://127.0.0.1:5000/upload-to-dataset", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(() => {
            console.log("File caricato con successo nella cartella dataset.");
          })
          .catch((error) => {
            console.error("Errore durante il caricamento del file:", error);
          });
      }

      // Nascondi le stelline con l'animazione
      setTimeout(() => {
        this.starsHidden = true;
      }, 300);
    },
    showThankYou() {
      this.showThankYouMessage = true;
    },
    // Funzione per ottenere l'immagine corretta in base al rating
    getStarImage(index) {
      // Se l'indice della stellina è minore o uguale al rating, è piena
      return index <= this.selectedRating ? this.starFilled : this.starEmpty;
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

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.img-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.img-preview {
  width: 50vw;
  max-width: 100%;
  height: auto;
  max-height: 50vh;
  object-fit: contain;
  margin-top: 15px;
}

@media (max-width: 767px) {
  .img-preview {
    width: 60vw;
    max-height: 50vh;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .img-preview-container {
    padding: 10px;
  }
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

.btn-select {
  background: #d9d9d9;
  color: black;
  width: 40%;
  margin-top: 10px;
  padding: 0.4rem;
  font-size: 13px;
}

.btn-upload,
.btn-new-prediction {
  margin: 0; /* Rimuove eventuali margini inutili */
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 40%; /* Imposta larghezza al 100% del contenitore */
  max-width: 300px; /* Imposta una larghezza massima */
  min-width: 100px; /* Imposta una larghezza minima */
  font-size: 13px;
  transition: background-color 0.3s ease;
  text-align: center;
}

.btn-upload {
  background-color: #007bff;
  color: white;
}

.btn-upload:hover {
  background-color: #0056b3;
}

.btn-new-prediction {
  background: #d9d9d9; /* Colore grigio chiaro */
  color: black; /* Colore del testo */
}

.btn-new-prediction:hover {
  background: #bfbfbf;
}

/* Aggiungi un po' di spazio tra i pulsanti */
.gap-2 {
  gap: 10px;
}

@media (max-width: 768px) {
  /* Per schermi piccoli, impila i pulsanti verticalmente */
  .flex-md-row {
    flex-direction: column;
  }
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
  margin: 0px auto; /* Centrato orizzontalmente */
  margin-top: 20px;
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
  width: 350%; /* Imposta la larghezza del checkbox a 100% */
  height: 60%;
  padding: 0;
  margin-bottom: 4vh;
  margin-left: 5vh;
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
  position: relative; /* Posizione relativa per il contenitore */
  width: 100%; /* Si adatta alla larghezza del contenitore */
  height: 100px; /* Imposta l'altezza del container */
  display: flex;
  justify-content: center; /* Centra orizzontalmente i pulsanti */
  align-items: center; /* Centra verticalmente i pulsanti */
  z-index: 11;
}

/* Stili esistenti per i pulsanti Left/Right */
#button-1 .knobs:before,
#button-1 .knobs:after {
  position: absolute;
  width: 60%; /* Inizialmente i pulsanti avranno una larghezza più ampia */
  height: 30px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 9px 4px;
  border-radius: 5px;
  transition: 0.3s cubic-bezier(0.18, 0.89, 0.35, 1.15) all, opacity 0.3s ease,
    z-index 0.3s ease, transform 0.3s ease;
  left: 50%; /* Allinea al centro orizzontale */
  transform: translateX(-50%); /* Centra perfettamente al centro */
}

#button-1 .knobs:before {
  content: "Left";
  top: 0; /* Pulsante Left in cima */
  background-color: #03a9f4;
  opacity: 1;
  z-index: 2; /* Priorità superiore */
  transform: scale(1); /* Pulsante Left alla dimensione normale */
  left: 50%;
  transform: translateX(-50%); /* Centra entrambi i pulsanti */
}

#button-1 .knobs:after {
  content: "Right";
  top: 30px; /* Pulsante Right sotto */
  background-color: #f44336;
  opacity: 0.5;
  z-index: 1; /* Priorità inferiore */
  transform: scale(0.8); /* Pulsante Right non selezionato più piccolo */
  left: 50%; /* Allinea al centro orizzontale */
  transform: translateX(-50%) scale(0.8); /* Centra e scala il pulsante */
}

/* Quando il checkbox è selezionato, cambia la posizione e la dimensione */
#button-1 .checkbox:checked + .knobs:before {
  top: 30px; /* Quando selezionato, si sposta in basso */
  opacity: 0.5;
  z-index: 1;
  transform: translateX(-50%) scale(0.8); /* Il pulsante Left diventa più piccolo */
}

#button-1 .checkbox:checked + .knobs:after {
  top: 0; /* Quando selezionato, il pulsante Right va sopra */
  opacity: 1;
  z-index: 2;
  transform: translateX(-50%) scale(1); /* Il pulsante Right diventa più grande */
}

#button-1 .layer {
  width: 100%;
  background-color: #ebf7fc;
  transition: background-color 0.3s ease;
}

#button-1 .checkbox:checked ~ .layer {
  background-color: #fcebeb;
}

/* Media Queries per schermi più piccoli */
@media (max-width: 767px) {
  #button-1 .knobs:before,
  #button-1 .knobs:after {
    width: 80%; /* Più larghi su schermi piccoli per una buona visibilità */
    font-size: 12px; /* Ridurre la dimensione del font */
    padding: 6px 3px; /* Ridurre il padding per schermi stretti */
  }

  /* Posizionamento dei pulsanti su schermi piccoli */
  #button-1 .knobs:before {
    top: 0; /* Pulsante Left in cima */
  }

  #button-1 .knobs:after {
    top: 60px; /* Pulsante Right un po' più sotto */
  }

  /* Quando il checkbox è selezionato, cambia la posizione e la dimensione */
  #button-1 .checkbox:checked + .knobs:before {
    top: 60px; /* "Left" scende sotto */
    opacity: 0.5;
    z-index: 1;
    transform: translateX(-50%) scale(0.8); /* Diventa più piccolo */
  }

  #button-1 .checkbox:checked + .knobs:after {
    top: 0; /* "Right" sale sopra */
    opacity: 1;
    z-index: 2;
    transform: translateX(-50%) scale(1); /* Diventa più grande */
  }

  #button-1 .layer {
    background-color: #fcebeb;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Assicurati che l'overlay sia sopra tutto */
}

.loading-icon {
  width: 50px;
  height: 50px;
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

.star-rating {
  text-align: center;
}

.stars {
  display: flex;
  justify-content: center;
}

.star {
  width: 30px; /* Riduci la larghezza */
  height: 30px; /* Riduci l'altezza */
  margin: 0 4px; /* Distanza tra le stelline */
  cursor: pointer;
}

.fade-out-stars-enter-active,
.fade-out-stars-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-out-stars-enter-from,
.fade-out-stars-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.fade-out-stars-leave-active {
  opacity: 0;
}

.fade-in-thank-you-enter-active {
  transition: opacity 0.8s ease;
}
.fade-in-thank-you-enter-from {
  opacity: 0;
}
.fade-in-thank-you-enter-to {
  opacity: 1;
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
