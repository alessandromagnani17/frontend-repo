<template>
  <div class="welcome">
    <div class="container mt-5">
      <h1 class="view-radiographs">Visualizza radiografie</h1>

      <!-- Messaggio di caricamento -->
      <div v-if="isLoading" class="alert alert-info small-text">
        Caricamento...
      </div>

      <!-- Contenuto per il ruolo di 'doctor' o 'patient' -->
      <div v-else-if="role === 'doctor' || role === 'patient'">
        <!-- Sezione per il selettore di pazienti per il medico -->
        <div v-if="role === 'doctor'" class="select-container mb-4">
          <select
            v-if="patients.length > 0 && !selectedPatientId"
            v-model="selectedPatientId"
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

        <!-- Sezione per il paziente selezionato -->
        <div v-if="selectedPatientId" class="mt-2">
          <div
            v-if="role === 'doctor' && selectedPatientId"
            class="patient-info-container small-text"
          >
            <span>
              Utente selezionato:
              <strong>
                {{ selectedPatientName }} {{ selectedPatientSurname }} <br />
              </strong>
              (ID: {{ selectedPatientId }})
            </span>
            <span class="change-text" @click="changePatient">Cambia</span>
          </div>
          <div v-else class="medium-text">
            Benvenuto
            <strong class="medium-text">
              {{ selectedPatientName }} {{ selectedPatientSurname }}!
            </strong>
          </div>

          <!-- Messaggio di x delle radiografie -->
          <div
            v-if="isLoadingRadiographs"
            class="alert alert-info mt-3 small-text"
          >
            Caricamento delle radiografie...
          </div>

          <!-- Sezione per visualizzare le radiografie -->
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
              class="card"
            >
              <img
                :src="radiograph.original_image"
                class="card-img-top"
                alt="Radiografia"
              />
              <div class="card-body">
                <h5 class="card-title small-text">
                  Radiografia {{ index + 1 }}
                </h5>
              </div>
            </div>
          </div>

          <!-- Messaggio di errore nel caso non ci siano radiografie -->
          <div v-else>
            <div
              v-if="errorNoRadiographies"
              class="alert alert-danger mt-3 small-text"
            >
              <p class="alert-text">
                L'utente {{ selectedPatientName }}
                {{ selectedPatientSurname }} non ha radiografie.
              </p>
            </div>
          </div>
        </div>

        <!-- Sezione per mostrare se non ci sono pazienti per il medico -->
        <div
          v-if="patients.length == 0 && role === 'doctor'"
          class="text-danger"
        >
          <p>Non hai pazienti.</p>
        </div>
      </div>

      <!-- Messaggio per utenti senza permessi -->
      <div v-else>
        <p class="text-muted">
          Non hai i permessi per visualizzare le radiografie.
        </p>
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
  created() {
    this.loadData(); // Chiama il metodo asincrono separato
  },
  methods: {
    async loadData() {
      const userDataString = localStorage.getItem("userData");
      const userData = JSON.parse(userDataString);
      this.role = userData.role;

      if (this.role === "doctor") {
        this.patients = await getPatientsFromDoctor(userData.doctorID);
      } else if (this.role === "patient") {
        this.selectedPatientId = userData.uid;
        this.selectedPatientName = localStorage.getItem("Name");
        this.selectedPatientSurname = localStorage.getItem("Surname");
        this.isLoadingRadiographs = true;

        this.userRadiographs = await loadRadiographiesForPatient(
          this.selectedPatientId
        );

        if (this.userRadiographs.length === 0) {
          this.errorNoRadiographies = true;
        } else {
          this.errorNoRadiographies = false;
        }

        this.isLoadingRadiographs = false;
      }
      this.isLoading = false;
    },
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
      this.$router.push({ name: "ViewRadiographs" });
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

h1.view-radiographs {
  font-size: 18px; /* Stessa dimensione del testo di "Elenco Pazienti" */
  font-family: inherit; /* Assicura che usi lo stesso font ereditato dal contesto */
  font-weight: normal; /* Mantenere il peso del font uguale */
  margin-bottom: 20px; /* Margine inferiore uguale per allineamento */
}
.img-preview {
  max-width: 100%;
  max-height: 50vh;
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
  max-height: 50vh;
  object-fit: cover; /* Mantieni le proporzioni dell'immagine */
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
    font-size: 1.2rem; /* Ridotto per i dispositivi più piccoli */
  }

  .sidebar {
    display: none;
  }
}

.select-container {
  margin-top: 15px; /* Spazio sopra il menu a tendina */
  margin-bottom: 10px; /* Spazio sotto il menu a tendina */
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
  max-width: 80%; /* Imposta la larghezza massima desiderata */
  margin: 0 auto; /* Centra il menu a tendina */
}

.card {
  flex: 0 0 29%; /* Imposta la larghezza al 30% per avere 3 card per riga */
  margin: 0.8vw;
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

.btn-primary {
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
}

.btn-primary:hover {
  background-color: #0056b3;
}

.small-text {
  font-size: 13px;
}

.medium-text {
  font-size: 14px;
}

/* Applica una riduzione globale della dimensione del testo per tutto il corpo della pagina */
body {
  font-size: 13px; /* Ridotto la dimensione del testo per tutto il corpo */
  line-height: 1.4; /* Aumentato l'interlinea per una lettura più facile */
}

.alert.alert-danger {
  display: flex; /* Abilita Flexbox */
  align-items: center; /* Centra il contenuto verticalmente */
  justify-content: center; /* Centra il contenuto orizzontalmente */
  padding: 8px 15px; /* Riduce l'altezza complessiva */
  font-size: 14px; /* Riduce la dimensione del testo */
  line-height: 1.2; /* Compatta l'interlinea */
  margin-bottom: 10px; /* Margine inferiore */
  border-radius: 5px; /* Bordo arrotondato */
  text-align: center; /* Centra il testo se multilinea */
  min-height: 50px; /* Imposta un'altezza minima per coerenza */
  box-sizing: border-box; /* Include padding nei calcoli dell'altezza */
}

.alert-text {
  margin: 0; /* Rimuove margini aggiuntivi del paragrafo */
}
</style>
