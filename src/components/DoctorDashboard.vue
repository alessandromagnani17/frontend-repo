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
import PatientList from "./PatientList.vue";
import PatientRadiographs from "./PatientRadiographs.vue";
import UploadRadiograph from "./UploadRadiographs.vue";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { getRadiographs, getPatients } from "../services/api-service";

export default {
  components: {
    PatientList,
    PatientRadiographs,
    UploadRadiograph,
  },
  setup() {
    const store = useStore(); // Crea un'istanza dello store
    const patients = ref([]);
    const selectedPatient = ref(null);
    const selectedPatientRadiographs = ref([]);

    // Ottieni l'ID del dottore loggato
    const doctorId = store.state.user.id;

    onMounted(async () => {
      // Ottieni i pazienti associati
      patients.value = await getPatients(doctorId);
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
