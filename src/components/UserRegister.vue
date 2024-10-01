<template>
  <div class="register">
    <div class="container mt-5">
      <h2 class="mb-4">Create Your Account</h2>
      <form @submit.prevent="onSubmit">
        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-control"
            required
          />
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-control"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            required
          />
        </div>

        <!-- Nome -->
        <div class="mb-3">
          <label for="nome" class="form-label">Nome</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            class="form-control"
            required
          />
        </div>

        <!-- Cognome -->
        <div class="mb-3">
          <label for="cognome" class="form-label">Cognome</label>
          <input
            id="cognome"
            v-model="form.cognome"
            type="text"
            class="form-control"
            required
          />
        </div>

        <!-- Data di nascita -->
        <div class="mb-3">
          <label for="data" class="form-label">Data di nascita</label>
          <input
            id="data"
            v-model="form.data"
            type="date"
            class="form-control"
            required
          />
        </div>

        <!-- Numero di telefono -->
        <div class="mb-3">
          <label for="telefono" class="form-label">Numero di telefono</label>
          <input
            id="telefono"
            v-model="form.telefono"
            type="tel"
            class="form-control"
            required
          />
        </div>

        <!-- Gender -->
        <div class="mb-3">
          <label for="gender" class="form-label">Gender</label>
          <select
            id="gender"
            v-model="form.gender"
            class="form-control"
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <!-- Address -->
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input
            id="address"
            v-model="form.address"
            type="text"
            class="form-control"
            required
          />
        </div>

        <!-- Submit button -->
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>

        <!-- Error message -->
        <div v-if="errors.general" class="invalid-feedback mt-3">
          {{ errors.general }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterComponent",
  data() {
    return {
      form: {
        username: "",
        email: "",
        password: "",
        nome: "",
        cognome: "",
        data: "",
        telefono: "",
        gender: "", // Aggiungi il campo gender
        address: "", // Aggiungi il campo address
      },
      errors: {},
      loading: false,
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      this.errors = {};

      try {
        const {
          username,
          email,
          password,
          nome,
          cognome,
          data,
          telefono,
          gender,
          address,
        } = this.form;

        // Logga i dati inviati per la registrazione
        console.log("Dati registrazione:", {
          username,
          email,
          password,
          nome,
          cognome,
          data,
          telefono,
          gender,
          address,
        });

        const response = await axios.post("http://127.0.0.1:5000/register", {
          username,
          email,
          password,
          nome,
          cognome,
          data,
          telefono,
          gender, // Passa il gender
          address, // Passa l'address
        });

        alert(
          "Registration successful! Please check your email for verification."
        );
        console.log(response.data);
      } catch (error) {
        console.error("Error signing up:", error);

        if (error.response) {
          console.error("Response data:", error.response.data);
          this.errors.general =
            error.response.data.error || "Registration failed";
        } else {
          this.errors.general = error.message;
        }

        alert("Error signing up: " + this.errors.general);
      } finally {
        this.loading = false;
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
