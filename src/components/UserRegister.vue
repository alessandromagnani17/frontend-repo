<template>
  <div class="register">
    <div class="container mt-5">
      <h2 class="mb-4">Create Your Account</h2>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="username" class="form-label">Username (Email)</label>
          <input
            id="username"
            v-model="form.username"
            type="email"
            class="form-control"
            required
          />
          <div v-if="errors.general" class="invalid-feedback">
            {{ errors.general }}
          </div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            required
          />
          <div v-if="errors.general" class="invalid-feedback">
            {{ errors.general }}
          </div>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>
        <div v-if="errors.general" class="invalid-feedback mt-3">
          {{ errors.general }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Importa axios per le chiamate API

export default {
  name: "RegisterComponent", // Assicurati di avere il nome corretto
  data() {
    return {
      form: {
        username: "", // Usa 'username' per l'email
        password: "",
      },
      errors: {},
      loading: false, // Aggiunto per il caricamento
    };
  },
  methods: {
    // Metodo per gestire la registrazione dell'utente
    async onSubmit() {
      // Cambiato qui
      console.log("Register button pressed");
      this.loading = true; // Avvia il caricamento
      this.errors = {}; // Resetta gli errori

      try {
        const { username, password } = this.form;
        console.log("Form Data:", this.form); // Visualizza i dati del form

        // Effettua la registrazione usando axios
        const response = await axios.post("http://127.0.0.1:5000/register", {
          email: username, // Usa 'username' come email
          password,
        });

        alert(
          "Registration successful! Please check your email for verification."
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error signing up:", error);
        alert("Error signing up: " + error.message); // Mostra un alert per l'errore

        // Gestione degli errori
        if (error.response && error.response.data) {
          this.errors.general =
            error.response.data.error || "Registration failed"; // Modificato qui
          alert(this.errors.general); // Mostra un alert per l'errore generale
        } else {
          this.errors.general = error.message; // Imposta l'errore generale
          alert("Error: " + error.message); // Mostra un alert per l'errore generale
        }
      } finally {
        this.loading = false; // Fine del caricamento
        console.log("Loading finished"); // Debug
      }
    },
  },
};
</script>

<style scoped>
.register {
  background: linear-gradient(135deg, #f7f7f7, #e0e0e0);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 600px;
  padding: 40px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2.5rem;
  color: #343a40;
}

.form-label {
  color: #495057;
}

.invalid-feedback {
  color: #dc3545;
}

.btn {
  margin-top: 20px;
  background-color: #007bff;
  border: none;
  transition: background-color 0.3s, transform 0.3s;
}

.btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>
