<template>
  <div class="dashboard">
    <div class="container">
      <div class="header">
        <h1>Dashboard Paziente</h1>
      </div>

      <div v-if="selectedPatient" class="info">
        <h2>Dettagli Paziente</h2>
        <div class="patient-info">
          <p><strong>Nome:</strong> {{ selectedPatient.name }}</p>
          <p><strong>Cognome:</strong> {{ selectedPatient.family_name }}</p>
          <p><strong>Email:</strong> {{ selectedPatient.email }}</p>
          <p>
            <strong>Data di nascita:</strong> {{ selectedPatient.birthdate }}
          </p>
          <p>
            <strong>Numero di telefono:</strong>
            {{ selectedPatient.phone_number }}
          </p>
          <p><strong>Indirizzo:</strong> {{ selectedPatient.address }}</p>
        </div>

        <div class="radiographs-section">
          <PatientRadiographs
            :radiographs="selectedPatientRadiographs"
            :patientId="selectedPatient.userId"
            :patientName="selectedPatient.name"
          />
        </div>
      </div>
      <div v-else>
        <p class="no-patient">Nessun paziente loggato trovato.</p>
      </div>
    </div>
  </div>
</template>

<script>
import PatientRadiographs from "./PatientRadiographs.vue";
import { ref, onMounted } from "vue";

export default {
  components: {
    PatientRadiographs,
  },
  setup() {
    const selectedPatient = ref(null);
    const selectedPatientRadiographs = ref([]);

    onMounted(() => {
      const userData = JSON.parse(localStorage.getItem("userData")); // Recupera le informazioni dell'utente loggato

      if (userData && userData.role === "patient") {
        selectedPatient.value = userData; // Imposta selectedPatient con userData
        console.log("Informazioni utente loggato:", userData); // Stampa le informazioni dell'utente
      } else {
        console.error("Nessun ID paziente trovato nel localStorage.");
      }
    });

    return {
      selectedPatient,
      selectedPatientRadiographs,
    };
  },
};
</script>

<style scoped>
.dashboard {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 600px;
  padding: 40px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
  width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 20px;
}

.no-patient {
  font-size: 14px;
  color: #999;
}

.info {
  margin-top: 30px;
}

.patient-info p {
  font-size: 14px;
  margin-bottom: 10px;
}

.radiographs-section {
  margin-top: 30px;
}

.btn-next {
  width: 100%;
  margin-top: 10px;
  padding: 0.4rem;
  cursor: pointer;
  font-size: 13px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-icon {
  width: 50px;
  height: 50px;
}
</style>
