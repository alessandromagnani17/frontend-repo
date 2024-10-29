<template>
  <div class="welcome">
    <aside class="sidebar bg-dark text-white">
      <h4 class="text-center mt-3">Link Rapidi</h4>
      <ul class="nav flex-column">
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/view-radiographs">
            Visualizza Radiografie
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/manage-patients">
            Gestisci Pazienti
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/reports">
            Rapporti
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link text-white" to="/predict">
            Predict
          </router-link>
        </li>
      </ul>
    </aside>

    <div class="container mt-5">
      <h5><strong>Carica una radiografia</strong></h5>
      <div>
        <input
          type="file"
          ref="fileInput"
          @change="onFileChange"
          accept="image/*"
          style="display: none"
        />
        <button @click="selectFile" class="btn btn-secondary">
          Seleziona file
        </button>
      </div>
      <div v-if="imagePreview" class="mt-3">
        <img :src="imagePreview" alt="Anteprima immagine" class="img-preview" />
      </div>
      <div v-if="imagePreview">
        <button @click="submitImage" class="btn btn-primary mt-5">
          Predici osteoartrite
        </button>
      </div>
      <div v-if="predictedClass !== null" class="mt-4">
        Predicted Class: {{ predictedClass }}
      </div>
      <div v-if="gradcamImage" class="mt-3">
        <img :src="gradcamImage" alt="Grad-CAM Image" class="img-preview" />
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
      selectedFileName: null, // Variabile per il nome del file selezionato
      predictedClass: null,
      imagePreview: null,
      gradcamImage: null,
    };
  },
  methods: {
    selectFile() {
      this.$refs.fileInput.click(); // Clicca sul campo di input file nascosto
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.selectedFile.name; // Memorizza il nome del file
      this.imagePreview = URL.createObjectURL(this.selectedFile); // Crea un'anteprima dell'immagine
    },
    async submitImage() {
      if (!this.selectedFile) return;

      const formData = new FormData();
      formData.append("file", this.selectedFile);

      const userData = JSON.parse(localStorage.getItem("userData"));
      const userUid = userData.uid;
      formData.append("userUID", userUid);

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

        console.log("Response from server:", response.data);
        this.predictedClass = response.data.predicted_class;
        this.gradcamImage = response.data.gradcam_image;
      } catch (error) {
        console.error("Error predicting image:", error);
      }
    },
  },
};
</script>

<style scoped>
.welcome {
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
}

.container {
  max-width: 600px;
  padding: 40px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
  height: auto;
  text-align: center;
  flex-grow: 1;
  margin-left: 20px;
}

.img-preview {
  max-width: 100%;
  max-height: 300px;
  margin-top: 15px;
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

.sidebar {
  top: 0;
  width: 250px;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(180deg, #212529, #343a40);
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
    font-size: 1.5rem;
  }

  .sidebar {
    display: none;
  }
}
</style>
