<template>
  <div class="welcome">
    <div class="container mt-5">
      <div class="header">
        <button v-if="!isLoading" class="back-button" @click="goBack">
          <img src="@/assets/back-icon.svg" alt="Indietro" class="back-icon" />
        </button>
      </div>
      <div v-if="isLoading" class="alert alert-info small-text">
        Caricamento delle informazioni...
      </div>
      <div v-else>
        <h1>Dettagli radiografia</h1>
        <table class="table table-bordered mt-3">
          <tbody>
            <tr>
              <th>Uid paziente</th>
              <td>{{ radiographInfo.userId }}</td>
            </tr>
            <tr>
              <th>Nome</th>
              <td>{{ radiographInfo.name }}</td>
            </tr>
            <tr>
              <th>Cognome</th>
              <td>{{ radiographInfo.surname }}</td>
            </tr>
            <tr>
              <th>Genere</th>
              <td>{{ radiographInfo.gender }}</td>
            </tr>
            <tr>
              <th>Data di Nascita</th>
              <td>{{ radiographInfo.birthdate }}</td>
            </tr>
            <tr>
              <th>Codice Fiscale</th>
              <td>{{ radiographInfo.tax_code }}</td>
            </tr>
            <tr>
              <th>Indirizzo</th>
              <td>{{ radiographInfo.address }}</td>
            </tr>
            <tr>
              <th>CAP</th>
              <td>{{ radiographInfo.cap_code }}</td>
            </tr>
          </tbody>
        </table>
        <div class="row">
          <div class="col-md-6 col-12">
            <div class="card">
              <img
                :src="original_image_url"
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
                :src="gradcam_image_url"
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
            <h5 class="card-title">
              {{ radiographInfo.prediction }} ({{
                radiographInfo.side ? "Ginocchio destro" : "Ginocchio sinistro"
              }})
            </h5>
          </div>
        </div>
        <div v-if="userRole === 'doctor'" class="mt-5">
          <h1>Informazioni caricamento</h1>
          <table class="table table-bordered mt-3">
            <tbody>
              <tr>
                <th>Dottore</th>
                <td>{{ radiographInfo.doctorLoaded }}</td>
              </tr>
              <tr>
                <th>Uid dottore</th>
                <td>{{ radiographInfo.doctorUid }}</td>
              </tr>
              <tr>
                <th>ID dottore</th>
                <td>{{ radiographInfo.doctorID }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRadiographInformation } from "@/services/api-service";

export default {
  data() {
    return {
      patient_id: "",
      userRole: "",
      index: "",
      original_image_url: "",
      gradcam_image_url: "",
      isLoading: true,
      radiographInfo: {
        name: "",
        surname: "",
        birthdate: "",
        tax_code: "",
        address: "",
        cap_code: "",
        gender: "",
        userId: "",
        radiograph_id: "",
        date: "",
        prediction: "",
        side: "",
        confidence: "",
        doctorLoaded: "",
        doctorUid: "",
        doctorID: "",
      },
    };
  },
  async created() {
    this.isLoading = true;
    this.patient_id = this.$route.query.patient_id;
    this.index = this.$route.query.index;
    const radiographInfoJson = await getRadiographInformation(
      this.patient_id,
      this.index
    );
    this.radiographInfo = radiographInfoJson;
    this.original_image_url = localStorage.getItem("selected_original_img");
    this.gradcam_image_url = localStorage.getItem("selected_gradcam_img");
    const userData = JSON.parse(localStorage.getItem("userData"));
    this.userRole = userData?.role || null;
    this.isLoading = false;
  },
  methods: {
    goBack() {
      localStorage.setItem("selectedPatientName", this.radiographInfo.name);
      localStorage.setItem(
        "selectedPatientSurname",
        this.radiographInfo.surname
      );
      localStorage.setItem("selected_original_img", "");
      localStorage.setItem("selected_gradcam_img", "");
      this.$router.push({
        name: "ViewRadiographs",
        query: {
          patient_id: this.radiographInfo.userId,
        },
      });
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
  max-width: 80%; /* Modifica qui per utilizzare una percentuale */
  padding: 5%; /* Usa percentuali per il padding */
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  margin-top: 10%; /* Usa percentuali per il margine superiore */
  height: auto;
  text-align: center;
  flex-grow: 1;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.row {
  display: flex; /* Usa Flexbox per le card */
  flex-wrap: wrap; /* Permetti alle card di andare a capo se necessario */
  margin-bottom: 20px; /* Margine inferiore per la separazione */
  height: 10%;
}

table,
th,
td {
  font-size: 13px; /* Riduzione della dimensione del testo nelle tabelle */
}

th {
  font-weight: bold; /* Rende il testo nei titoli delle celle in grassetto */
}

.card-body {
  font-size: 13px; /* Riduzione della dimensione del testo nel corpo della card */
}

.card-title {
  font-size: 14px; /* Riduzione della dimensione del titolo nella card */
}

button {
  font-size: 13px; /* Riduzione della dimensione del testo nel pulsante */
}

.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 45%;
  min-width: 150px;
  font-size: 13px;
  transition: background-color 0.3s ease;
  text-align: center;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-button {
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: -10px;
}

.back-icon {
  width: 30px;
  height: 30px;
}

.small-text {
  font-size: 13px;
}
</style>
