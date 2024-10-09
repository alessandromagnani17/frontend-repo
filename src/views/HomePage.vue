<template>
  <div class="home">
    <div class="container text-center">
      <h1 class="display-3">Welcome to Radiology Portal</h1>
      <p class="lead">
        Explore and manage radiographs with ease and efficiency, crafted for
        both doctors and patients.
      </p>
      <img
        src="../assets/knee-xray.png"
        alt="Knee X-Ray"
        class="img-fluid mb-4"
      />
      <div class="btn-group mt-4">
        <!-- Puoi mantenere i link o rimuoverli in base alle tue preferenze -->
        <router-link to="/login" class="btn btn-primary btn-lg mx-2">
          Accedi
        </router-link>
        <router-link to="/register" class="btn btn-secondary btn-lg mx-2">
          Registrati
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  mounted() {
    console.log(
      "HomePage mounted - AWS Amplify Cognito is configured. No API calls are made."
    );
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
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Stile per l'immagine */
.img-fluid {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px; /* Spazio sotto l'immagine */
}

h1 {
  font-size: 2.5rem;
  color: #212529;
  animation: fadeIn 1.5s ease-out;
}

p {
  font-size: 1rem;
  color: #6c757d;
}

/* Stile comune per i pulsanti */
.btn {
  width: calc(
    100% - 20px
  ); /* Larghezza totale meno margine per evitare tagli */
  padding: 0.5rem 1.5rem;
  font-size: 14px;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  transition: background-color 0.3s, transform 0.3s;
  margin: 10px 10px 0 10px; /* Spazio uniforme intorno ai pulsanti */
}

/* Pulsante secondario */
.btn-secondary {
  background-color: #d9d9d9; /* Colore grigio chiaro */
  color: black;
}

.btn-secondary:hover {
  background-color: #5a6268; /* Colore al passaggio del mouse */
  color: white; /* Testo bianco al passaggio del mouse */
  transform: translateY(-1.5px); /* Sollevamento leggero */
}

/* Pulsante primario */
.btn-primary {
  background-color: #007bff; /* Colore blu primario */
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3; /* Colore più scuro */
  transform: translateY(-1.5px); /* Sollevamento leggero */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
