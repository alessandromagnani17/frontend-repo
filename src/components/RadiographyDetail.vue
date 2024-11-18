<template>
  <div class="welcome">
    <div class="container mt-5">
      <div v-if="isLoading" class="alert alert-info">
        Caricamento delle informazioni...
      </div>
      <div v-else>
        <h5><strong>Visualizzazione radiografia</strong></h5>
        <table class="table table-bordered mt-3">
          <tbody>
            <tr>
              <th>Uid paziente</th>
              <td>{{ radiographyInfo.userId }}</td>
            </tr>
            <tr>
              <th>Nome</th>
              <td>{{ radiographyInfo.name }}</td>
            </tr>
            <tr>
              <th>Cognome</th>
              <td>{{ radiographyInfo.surname }}</td>
            </tr>
            <tr>
              <th>Genere</th>
              <td>{{ radiographyInfo.gender }}</td>
            </tr>
            <tr>
              <th>Data di Nascita</th>
              <td>{{ radiographyInfo.birthdate }}</td>
            </tr>
            <tr>
              <th>Genere</th>
              <td>{{ radiographyInfo.gender }}</td>
            </tr>
            <tr>
              <th>Codice Fiscale</th>
              <td>{{ radiographyInfo.tax_code }}</td>
            </tr>
            <tr>
              <th>Indirizzo</th>
              <td>{{ radiographyInfo.address }}</td>
            </tr>
            <tr>
              <th>CAP</th>
              <td>{{ radiographyInfo.cap_code }}</td>
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
              {{ radiographyInfo.prediction }} ({{
                radiographyInfo.side
                  ? "Ginocchio destro"
                  : "Ginocchio sinistro"
              }})
            </h5>
          </div>
        </div>
        <div v-if="userRole === 'doctor'">
          <h5><strong>Informazioni caricamento</strong></h5>
          <table class="table table-bordered mt-3">
            <tbody>
              <tr>
                <th>Dottore</th>
                <td>{{ radiographyInfo.doctorLoaded }}</td>
              </tr>
              <tr>
                <th>Uid dottore</th>
                <td>{{ radiographyInfo.doctorUid }}</td>
              </tr>
              <tr>
                <th>ID dottore</th>
                <td>{{ radiographyInfo.doctorID }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button @click="goBack" class="btn btn-primary mt-3">
          Torna alla lista delle radiografie
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getRadiographyInformation } from "@/services/api-service";

export default {
  data() {
    return {
      patient_id: "",
      userRole: "",
      index: "",
      original_image_url: "",
      gradcam_image_url: "",
      isLoading: true,
      radiographyInfo: {
        name: "",
        surname: "",
        birthdate: "",
        tax_code: "",
        address: "",
        cap_code: "",
        gender: "",
        userId: "",
        radiography_id: "",
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
    const radiographyInfoJson = await getRadiographyInformation(
      this.patient_id,
      this.index
    );
    this.radiographyInfo = radiographyInfoJson;
    this.original_image_url = localStorage.getItem("selected_original_img");
    this.gradcam_image_url = localStorage.getItem("selected_gradcam_img");
    const userData = JSON.parse(localStorage.getItem("userData"));
    this.userRole = userData?.role || null;
    this.isLoading = false;
  },
  methods: {
    goBack() {
      localStorage.setItem("selectedPatientId", this.radiographyInfo.userId);
      localStorage.setItem("selected_original_img", "");
      localStorage.setItem("selected_gradcam_img", "");
      this.$router.push({
        name: "ViewRadiographs",
        query: {
          patient_id: this.radiographyInfo.userId,
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

.row {
  display: flex; /* Usa Flexbox per le card */
  flex-wrap: wrap; /* Permetti alle card di andare a capo se necessario */
  margin-bottom: 20px; /* Margine inferiore per la separazione */
  height: 10%;
}
</style>
