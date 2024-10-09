<template>
  <div>
    <h2>Carica Radiografia</h2>
    <input type="file" @change="onFileChange" />
    <button @click="upload">Carica</button>
  </div>
</template>

<script>
import { uploadRadiograph, getPatients } from "../services/api-service"; // Importa le funzioni necessarie

export default {
  data() {
    return {
      file: null,
      patients: [],
    };
  },
  async created() {
    const doctorId = this.$store.state.user.id; // ID del dottore loggato
    this.patients = await getPatients(doctorId); // Ottieni la lista dei pazienti
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async upload() {
      if (!this.file) {
        alert("Per favore seleziona un file.");
        return;
      }

      try {
        const patientId = this.$props.patientId; // Assicurati che patientId sia passato come prop
        const response = await uploadRadiograph(patientId, this.file);
        this.$emit("uploadSuccess", response); // Notifica il successo del caricamento
      } catch (error) {
        console.error(error.message);
        alert("Errore nel caricamento della radiografia.");
      }
    },
  },
};
</script>
