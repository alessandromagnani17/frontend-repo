<template>
  <div class="welcome">
    <div class="container mt-5">
      <h5><strong>Carica una radiografia</strong></h5>
      <div>
        <input type="file" @change="onFileChange" accept="image/*" />
      </div>
      <div v-if="imagePreview" class="mt-3">
        <img :src="imagePreview" alt="Anteprima immagine" class="img-preview" />
      </div>
      <div>
        <button @click="submitImage" class="btn btn-primary mt-5">
          Predict
        </button>
      </div>
      <div v-if="predictedClass !== null" class="mt-4">
        Predicted Class: {{ predictedClass }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedFile: null,
      predictedClass: null,
      imagePreview: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.imagePreview = URL.createObjectURL(this.selectedFile);
    },
    async submitImage() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/predict",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        this.predictedClass = response.data.predicted_class;
      } catch (error) {
        console.error("Error predicting image:", error);
      }
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
  max-width: 600px; /* Limita la larghezza massima */
  width: 100%; /* Assicura che il contenitore occupi il 100% della larghezza */
  padding: 40px;
  border-radius: 15px;
  background: #ffffff; /* Sfondo del contenitore */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); /* Ombra del contenitore */
  margin-top: 100px; /* Margine superiore */
  height: auto; /* Altezza automatica */
  text-align: center; /* Centra il testo */
  margin-left: auto; /* Margini automatici per centrare orizzontalmente */
  margin-right: auto; /* Margini automatici per centrare orizzontalmente */
}

.img-preview {
  max-width: 100%; /* Limita la larghezza massima delle anteprime */
  max-height: 300px; /* Limita l'altezza massima delle anteprime */
  margin-top: 15px; /* Margine superiore */
}

h2 {
  font-size: 18px;
  margin-bottom: 30px;
}

p {
  font-size: 14px;
  color: #6c757d;
}

.btn-group .btn {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
