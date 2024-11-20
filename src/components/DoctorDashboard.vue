<template>
  <div class="dashboard">
    <div class="container">
      <div class="header">
        <h1>Dashboard Dottore</h1>
      </div>

      <div v-if="patients.length > 0">
        <h2>Elenco Pazienti</h2>
        <ul class="patient-list">
          <li
            v-for="patient in patients"
            :key="patient.userId"
            @click="selectPatient(patient)"
            class="patient-item"
          >
            {{ patient.name }} {{ patient.family_name }}
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="no-patients">Nessun paziente associato trovato.</p>
      </div>

      <div v-if="selectedPatient" class="details">
        <h2>Dettagli Paziente</h2>
        <div class="patient-details">
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
    </div>
  </div>
</template>

<script>
import PatientRadiographs from "./PatientRadiographs.vue";
import { ref, onMounted } from "vue";
import { getPatientsFromDoctor, getRadiographs } from "../services/api-service";

export default {
  components: {
    PatientRadiographs,
  },
  setup() {
    const patients = ref([]);
    const selectedPatient = ref(null);
    const selectedPatientRadiographs = ref([]);

    const doctorId = localStorage.getItem("doctorId");
    console.log("doctorID: ", doctorId);

    onMounted(async () => {
      if (doctorId) {
        try {
          patients.value = await getPatientsFromDoctor(doctorId);
        } catch (error) {
          console.error("Errore nel caricamento dei pazienti:", error);
        }
      } else {
        console.error("Nessun DoctorID trovato nel localStorage.");
      }
    });

    const selectPatient = async (patient) => {
      selectedPatient.value = patient;
      selectedPatientRadiographs.value = []; // Svuota le radiografie precedenti

      console.log("Patient ID selezionato:", patient.userId); // Debug per verificare il patientId

      if (!patient.userId) {
        console.error("ID paziente non trovato.");
        return;
      }

      try {
        selectedPatientRadiographs.value =
          (await getRadiographs(patient.userId)) || [];
        console.log("Radiografie caricate:", selectedPatientRadiographs.value); // Debug per verificare le radiografie caricate
      } catch (error) {
        console.error(
          "Errore nel caricamento delle radiografie per il paziente:",
          error
        );
      }
    };

    return {
      patients,
      selectPatient,
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

.patient-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.patient-item {
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  margin-bottom: 10px;
  color: #007bff;
}

.patient-item:hover {
  color: #0056b3;
}

.no-patients {
  font-size: 14px;
  color: #999;
}

.details {
  margin-top: 30px;
}

.patient-details p {
  font-size: 14px;
  margin-bottom: 10px;
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
