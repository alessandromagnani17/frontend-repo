<template>
  <div class="home">
    <div class="container text-center">
      <h1 class="display-3">Welcome to Radiology Portal</h1>
      <p class="lead">
        Explore and manage radiographs with ease and efficiency, crafted for
        both doctors and patients.
      </p>
      <!-- Mostra una serie di immagini di radiografie -->
      <div class="xray-images">
        <img
          v-for="(img, index) in xrayImages"
          :key="index"
          :src="require(`@/assets/${img}`)"
          alt="X-Ray"
          class="xray-img"
        />
      </div>
      <!-- Container per le immagini con carosello -->
      <div class="slider-container">
        <div class="slider">
          <img
            v-for="(img, index) in functionalityImages"
            :key="index"
            :src="require(`@/assets/${img}`)"
            alt="Functionality Image"
            class="slider-img"
            :class="{ active: index === currentImageIndex }"
          />
        </div>
        <!-- Pulsanti per scorrere -->
        <button class="slider-button prev" @click="prevImage">❮</button>
        <button class="slider-button next" @click="nextImage">❯</button>
        <!-- Puntini di navigazione -->
        <div class="slider-dots">
          <span
            v-for="(img, index) in functionalityImages"
            :key="index"
            class="dot"
            :class="{ active: index === currentImageIndex }"
            @click="setImage(index)"
          ></span>
        </div>
      </div>

      <!-- Pulsanti di accesso e registrazione -->
      <div class="btn-container">
        <router-link to="/login" class="btn btn-primary btn-lg mb-3 btn-access">
          Accedi
        </router-link>
        <!-- Linea e testo "oppure" -->
        <div class="line-container">
          <div class="line"></div>
          <span class="or-text">sei un nuovo utente?</span>
          <div class="line"></div>
        </div>
        <!-- Scritta per nuovi utenti -->
        <div class="btn-group-horizontal">
          <router-link
            to="/register"
            class="btn btn-secondary btn-lg btn-register"
            @click="setRole('patient')"
          >
            Registrati come Paziente
          </router-link>
          <router-link
            to="/register"
            class="btn btn-secondary btn-lg btn-register"
            @click="setRole('doctor')"
          >
            Registrati come Dottore
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      xrayImages: [
        "xray-1.png",
        "xray-2.png",
        "xray-3.png",
        "xray-4.png",
        "xray-5.png",
      ],
      functionalityImages: [
        "functionality1.png",
        "functionality2.png",
        "functionality3.png",
        "functionality4.png",
      ],
      currentImageIndex: 0,
      interval: null, // Timer per l'autoscorrimento
    };
  },
  methods: {
    setRole(role) {
      localStorage.setItem("userRole", role);
      this.$router.push("/register");
    },
    nextImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.functionalityImages.length; // Ciclo attraverso le immagini
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.functionalityImages.length) %
        this.functionalityImages.length; // Ciclo attraverso le immagini
    },
    setImage(index) {
      this.currentImageIndex = index;
    },
    startAutoSlide() {
      this.interval = setInterval(this.nextImage, 6000); // Cambia immagine ogni 6 secondi
    },
    stopAutoSlide() {
      clearInterval(this.interval);
    },
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
};
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}

.container {
  max-width: 700px;
  padding: 40px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.xray-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.xray-img {
  width: calc(
    21% - 10px
  ); /* Riduce la larghezza per adattarsi a 4 immagini in una riga */
  height: auto;
}

.slider-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
  overflow: hidden;
  margin-bottom: 40px;
}

.slider {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.slider-img {
  width: 100%; /* Le immagini occupano tutto lo spazio */
  height: auto; /* Assicura che le immagini siano proporzionate */
  display: none; /* Nasconde tutte le immagini per default */
}

.slider-img.active {
  display: block; /* Mostra solo l'immagine attiva */
}

.slider-button {
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  font-size: 12px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 1;
}

.slider-button.prev {
  left: 10px;
}

.slider-button.next {
  right: 10px;
}

.slider-dots {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.dot {
  height: 10px;
  width: 10px;
  margin: 0 5px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.dot.active {
  background-color: #717171;
}

.btn {
  padding: 0.5rem 2rem;
  font-size: 13px;
  border-radius: 5px;
  transition: background-color 0.3s, transform 0.3s;
  border: none;
}

.btn-secondary {
  background-color: #d9d9d9;
  color: black;
  border: none;
}

.btn-primary {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  width: 100%;
  max-width: 470px;
  border: none;
  padding: 0.5rem 1rem; /* Modifica il padding per rendere l'altezza responsiva */
  font-size: 0.8rem; /* Imposta un font-size responsivo */
}

.btn-group-horizontal {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.btn-secondary:hover {
  background-color: #5a6268;
  color: white;
  transform: translateY(-1.5px);
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-1.5px);
}

.btn-register {
  width: 100%;
  max-width: 230px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
}

/* Nuovo CSS per la linea e il testo "oppure" */
.line-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.line {
  height: 1px;
  max-width: 300px;
  width: 22%;
  background-color: #d9d9d9;
  margin: 20px;
}

.or-text {
  margin: 0 10px; /* Spazio ai lati del testo "oppure" */
  font-size: 0.8rem;
}

.container h1 {
  font-size: 2rem;
}

.container p {
  font-size: 0.9rem;
}
</style>
