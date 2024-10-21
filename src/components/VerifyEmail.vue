<template>
  <div class="verify-email">
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
      </ul>
    </aside>

    <div class="container mt-5">
      <h2 class="mb-4">{{ verificationMessage }}</h2>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <div class="btn-group mt-4" v-if="!isLoading && !errorMessage">
        <router-link to="/" class="btn btn-primary btn-next">
          Torna alla Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "VerifyEmail",
  data() {
    return {
      verificationMessage: "Verificando la tua email...",
      errorMessage: null,
      isLoading: true,
    };
  },
  async mounted() {
    const uid = this.$route.params.uid; // Assicurati che l'UID sia presente nell'URL
    try {
      const response = await axios.get(
        `http://localhost:5000/verify-email/${uid}`
      );
      this.verificationMessage = response.data.message; // "Email verificata con successo!"
      console.log("Risposta server --> " + response.data.message);
    } catch (error) {
      this.errorMessage =
        error.response?.data?.error || "Errore durante la verifica dell'email.";
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<style scoped>
.verify-email {
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
  flex-grow: 1; /* Permette al contenuto principale di occupare lo spazio rimanente */
  margin-left: 20px; /* Margine sinistro per distanziare il contenuto dalla sidebar */
}

h2 {
  font-size: 18px; /* Uniforma il font size al login */
  margin-bottom: 30px;
}

p {
  font-size: 14px;
  color: #6c757d;
}

.btn-group .btn {
  width: 100%; /* Assicura che i bottoni occupino l'intera larghezza */
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
  width: 250px; /* Imposta la larghezza della sidebar */
  height: 100vh; /* Imposta l'altezza della sidebar al 100% della viewport */
  padding: 20px; /* Padding interno */
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
  padding: 10px 15px; /* Aggiunge padding ai link per migliorarne l'aspetto */
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
