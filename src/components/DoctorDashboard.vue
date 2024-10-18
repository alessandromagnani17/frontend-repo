<template>
  <div>
    <h1>Dashboard Dottore</h1>
    <PatientList :patients="patients" @selectPatient="selectPatient" />
    <UploadRadiograph
      v-if="selectedPatient"
      @uploadSuccess="handleUploadSuccess"
      :patientId="selectedPatient.id"
    />
    <PatientRadiographs
      :radiographs="selectedPatientRadiographs"
      v-if="selectedPatient"
    />
  </div>
</template>

<script>
import PatientRadiographs from "./PatientRadiographs.vue";
import UploadRadiograph from "./UploadRadiographs.vue";
import { ref, onMounted } from "vue";
import { getPatients, getRadiographs } from "../services/api-service"; // Assicurati di importare getPatients

export default {
  components: {
    PatientRadiographs,
    UploadRadiograph,
  },
  setup() {
    const patients = ref([]);
    const selectedPatient = ref(null);
    const selectedPatientRadiographs = ref([]);

    // Ottieni il DoctorID dal localStorage
    const doctorId = localStorage.getItem("doctorId");

    onMounted(async () => {
      console.log("Cerco pazienti associati a: " + doctorId);
      // Assicurati che doctorId non sia null
      if (doctorId) {
        // Ottieni i pazienti associati
        patients.value = await getPatients(doctorId);
      } else {
        console.error("Nessun DoctorID trovato nel localStorage.");
      }
    });

    // Seleziona un paziente e ottieni le sue radiografie
    const selectPatient = async (patient) => {
      selectedPatient.value = patient;
      selectedPatientRadiographs.value = await getRadiographs(patient.id);
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
