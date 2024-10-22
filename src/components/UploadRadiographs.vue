<template>
  <div class="upload-container">
    <h2>Carica Radiografia</h2>
    <input type="file" @change="onFileChange" class="file-input" />
    <button @click="upload" class="btn-upload">Carica</button>
  </div>
</template>

<script>
import {
  uploadRadiograph,
  getPatientsFromDoctor,
} from "../services/api-service";

export default {
  props: {
    patientId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      file: null,
      patients: [],
    };
  },
  async created() {
    const doctorId = this.$store.state.user.id;
    this.patients = await getPatientsFromDoctor(doctorId);
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
        const response = await uploadRadiograph(this.patientId, this.file);
        this.$emit("uploadSuccess", response);
      } catch (error) {
        console.error(error.message);
        alert("Errore nel caricamento della radiografia.");
      }
    },
  },
};
</script>

<style scoped>
.upload-container {
  background: #ffffff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  width: 100%;
}

h2 {
  font-size: 18px;
  margin-bottom: 15px;
}

.file-input {
  display: block;
  margin-bottom: 10px;
  padding: 8px; /* Ridotto padding */
  font-size: 12px; /* Ridotta dimensione del font */
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.btn-upload {
  background-color: #007bff;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.btn-upload:hover {
  background-color: #0056b3;
}
</style>
