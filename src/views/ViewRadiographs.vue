<template>
  <div class="radiographs-view">
    <h2>Le Tue Radiografie</h2>
    <div class="cards-container">
      <div
        v-for="(radiograph, index) in radiographs"
        :key="index"
        class="radiograph-card"
      >
        <img :src="radiograph.original_image" alt="Immagine Originale" />
        <img :src="radiograph.gradcam_image" alt="Immagine Grad-CAM" />
        <p>{{ radiograph.prediction }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// Importa Axios
import axios from "axios";

export default {
  data() {
    return {
      radiographs: [],
    };
  },
  created() {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const userUID = userData.uid;
      console.log("UID dell'utente:", userUID);

      // Chiama la funzione per recuperare le radiografie
      this.fetchRadiographs(userUID);
    } else {
      console.log("Nessun dato utente trovato in localStorage.");
    }
  },
  methods: {
    async fetchRadiographs(userUID) {
      try {
        const response = await axios.get(`/api/radiographs/${userUID}`);
        this.radiographs = response.data; // Supponendo che il backend restituisca un array di radiografie
        console.log("Radiografie recuperate:", this.radiographs);
      } catch (error) {
        console.error("Errore nel recupero delle radiografie:", error);
      }
    },
  },
};
</script>

<style scoped>
.view-radiographs {
  background: #ffffff; /* Sfondo bianco, simile alla pagina di login */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0); /* Rimuove ombre esterne */
}

.container {
  max-width: 600px;
  padding: 40px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); /* Simile alla shadow del login */
  margin-top: 100px;
  height: auto;
  text-align: center; /* Centra il testo */
}

h2 {
  font-size: 18px; /* Uniforma il font size al login */
  margin-bottom: 30px;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.radiograph-card {
  width: 300px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.radiograph-card img {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
