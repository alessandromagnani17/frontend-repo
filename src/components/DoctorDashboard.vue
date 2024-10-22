<template>
  <div>
    <h1>Dashboard Dottore</h1>

    <div v-if="patients.length > 0">
      <h2>Elenco Pazienti</h2>
      <ul>
        <li
          v-for="patient in patients"
          :key="patient.userId"
          @click="selectPatient(patient)"
          style="cursor: pointer; text-decoration: underline"
        >
          {{ patient.name }} {{ patient.family_name }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Nessun paziente associato trovato.</p>
    </div>

    <div v-if="selectedPatient">
      <h2>Dettagli Paziente</h2>
      <div>
        <p><strong>Nome:</strong> {{ selectedPatient.name }}</p>
        <p><strong>Cognome:</strong> {{ selectedPatient.family_name }}</p>
        <p><strong>Email:</strong> {{ selectedPatient.email }}</p>
        <p><strong>Data di nascita:</strong> {{ selectedPatient.birthdate }}</p>
        <p>
          <strong>Numero di telefono:</strong>
          {{ selectedPatient.phone_number }}
        </p>
        <p><strong>Indirizzo:</strong> {{ selectedPatient.address }}</p>
        <!-- Aggiungi qui ulteriori attributi del paziente se necessario -->
      </div>

      <UploadRadiograph
        @uploadSuccess="handleUploadSuccess"
        :patientId="selectedPatient.userId"
      />

      <PatientRadiographs
        :radiographs="selectedPatientRadiographs"
        :patientId="selectedPatient.userId"
        :patientName="selectedPatient.name"
      />
    </div>
  </div>
</template>

<script>
import PatientRadiographs from "./PatientRadiographs.vue";
import UploadRadiograph from "./UploadRadiographs.vue";
import { ref, onMounted } from "vue";
import { getPatientsFromDoctor, getRadiographs } from "../services/api-service";

export default {
  components: {
    PatientRadiographs,
    UploadRadiograph,
  },
  setup() {
    const patients = ref([]);
    const selectedPatient = ref(null);
    const selectedPatientRadiographs = ref([]); // Qui hai definito la proprietà

    // Ottieni il DoctorID dal localStorage
    const doctorId = localStorage.getItem("doctorId");

    onMounted(async () => {
      console.log("Cerco pazienti associati a: " + doctorId);
      if (doctorId) {
        // Ottieni i pazienti associati
        try {
          patients.value = await getPatientsFromDoctor(doctorId);
          console.log("patients.value: ", patients.value); // Stampa dopo l'assegnazione
        } catch (error) {
          console.error("Errore nel caricamento dei pazienti:", error);
        }
      } else {
        console.error("Nessun DoctorID trovato nel localStorage.");
      }
    });

    // Seleziona un paziente e ottieni le sue radiografie
    const selectPatient = async (patient) => {
      console.log("Paziente selezionato:", patient); // Log del paziente selezionato
      selectedPatient.value = patient;

      // Usa userId al posto di id
      if (!patient.userId) {
        console.error("ID paziente non trovato."); // Log dell'errore
        return;
      }

      try {
        // Imposta le radiografie su un array vuoto se non ci sono radiografie
        selectedPatientRadiographs.value =
          (await getRadiographs(patient.userId)) || []; // Cambiato da patient.id a patient.userId
        console.log("Radiografie caricate:", selectedPatientRadiographs.value); // Log delle radiografie caricate
      } catch (error) {
        console.error(
          "Errore nel caricamento delle radiografie per il paziente:",
          error
        );
      }
    };

    const handleUploadSuccess = () => {
      selectPatient(selectedPatient.value); // Ricarica le radiografie
    };

    return {
      patients,
      selectPatient,
      handleUploadSuccess,
      selectedPatient,
      selectedPatientRadiographs,
    };
  },
};
</script>

<style scoped>
/* Puoi aggiungere qui il tuo stile personalizzato per la dashboard */
</style>
