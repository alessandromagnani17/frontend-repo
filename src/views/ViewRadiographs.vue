<template>
  <div class="welcome">
    <div class="container mt-5">
      <h5><strong>Visualizza una radiografia</strong></h5>
      <div v-if="isLoading" class="alert alert-info">Caricamento...</div>
      <div v-else-if="role === 'doctor'">
        <div v-if="patients.length > 0">
          <div class="select-container mb-4">
            <select
              v-if="patients.length > 0 && !selectedPatientId"
              v-model="selectedPatientId"
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
          <div v-if="selectedPatientId" class="mt-2">
            <div>
              Utente selezionato:
              <strong
                >{{ selectedPatientName }} {{ selectedPatientSurname }} (ID:
                {{ selectedPatientId }})</strong
              >
            </div>
            <button @click="changePatient" class="btn btn-secondary mt-2">
              Cambia paziente
            </button>
          </div>
          <div v-if="isLoadingRadiographs" class="alert alert-info mt-3">
            Caricamento delle radiografie...
          </div>
          <div
            class="row mt-5"
            v-if="userRadiographs.length > 0 && selectedPatientId"
          >
            <div
              v-for="(radiograph, index) in userRadiographs"
              :key="radiograph.radiography_id"
              @click="
                goToRadiographDetail(
                  index,
                  radiograph.original_image,
                  radiograph.gradcam_image
                )
              "
              style="cursor: pointer"
              class="card"
            >
              <img
                :src="radiograph.original_image"
                class="card-img-top"
                alt="Radiografia"
              />
              <div class="card-body">
                <h5 class="card-title">Radiografia {{ index + 1 }}</h5>
              </div>
            </div>
          </div>
          <div v-else>
            <div v-if="errorNoRadiographies" class="alert alert-danger mt-3">
              <p>
                L'utente {{ selectedPatientName }}
                {{ selectedPatientSurname }} non ha radiografie.
              </p>
            </div>
          </div>
        </div>
        <div v-else>
          <p>NON hai pazienti.</p>
        </div>
      </div>
      <div v-else-if="role === 'patient'">
        <p>You can only see your own radiographs.</p>
      </div>
      <div v-else>
        <p>You do not have permission to view radiographs.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getPatientsFromDoctor } from "@/services/api-service";
import { loadRadiographiesForPatient } from "@/services/api-service";

export default {
  data() {
    return {
      patients: [],
      selectedPatientName: "",
      selectedPatientSurname: "",
      selectedPatientId: "",
      role: "",
      userRadiographs: [],
      isLoading: true,
      isLoadingRadiographs: false,
      errorNoRadiographies: false,
    };
  },
  async created() {
    const userDataString = localStorage.getItem("userData");
    const userData = JSON.parse(userDataString);
    const userUid = userData.doctorID;
    this.role = userData.role;
    if (this.role === "doctor") {
      this.patients = await getPatientsFromDoctor(userUid);
    }
    const id = this.$route.query.patient_id;
    if (id) {
      this.selectedPatientId = id;
      this.isLoadingRadiographs = true;
      const patient = this.patients.find(
        (p) => p.userId === this.selectedPatientId
      );

      if (patient) {
        this.selectedPatientName = patient.name;
        this.selectedPatientSurname = patient.family_name;
        this.selectedPatientId = patient.userId;
      }

      this.userRadiographs = await loadRadiographiesForPatient(
        this.selectedPatientId
      );

      if (this.userRadiographs.length == 0) {
        this.errorNoRadiographies = true;
      } else {
        this.errorNoRadiographies = false;
      }

      this.isLoadingRadiographs = false;
    }
    this.isLoading = false;
  },
  methods: {
    async onPatientChange() {
      this.userRadiographs = [];
      this.isLoadingRadiographs = true;
      const patient = this.patients.find(
        (p) => p.userId === this.selectedPatientId
      );

      if (patient) {
        this.selectedPatientName = patient.name;
        this.selectedPatientSurname = patient.family_name;
        this.selectedPatientId = patient.userId;
      }

      this.userRadiographs = await loadRadiographiesForPatient(
        this.selectedPatientId
      );

      if (this.userRadiographs.length == 0) {
        this.errorNoRadiographies = true;
      } else {
        this.errorNoRadiographies = false;
      }

      this.isLoadingRadiographs = false;
      this.$router.push({
        name: "ViewRadiographs",
        query: {
          patient_id: this.selectedPatientId,
        },
      });
    },
    changePatient() {
      this.selectedPatientId = "";
      this.selectedPatientName = "";
      this.selectedPatientSurname = "";
      this.userRadiographies = [];
      this.errorNoRadiographies = false;
      this.isLoadingRadiographs = false;
    },
    goToRadiographDetail(index, or, gd) {
      localStorage.setItem("selected_original_img", or);
      localStorage.setItem("selected_gradcam_img", gd);
      const idx = index + 1;
      this.$router.push({
        name: "RadiographyDetail",
        query: {
          patient_id: this.selectedPatientId,
          index: idx,
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
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.03); /* Leggero ingrandimento quando si passa sopra */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Aggiunge un'ombra per maggiore enfasi */
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

.card {
  flex: 0 0 30%; /* Imposta la larghezza al 30% per avere 3 card per riga */
  margin: 10px; /* Margine tra le card */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  border-radius: 0.5rem;
  max-height: 50vh; /* Limita l'altezza in percentuale */
  object-fit: cover; /* Mantieni le proporzioni dell'immagine */
}

.row {
  justify-content: flex-start; /* Assicura che le immagini siano allineate a sinistra */
}
</style>
