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
          <div class="input-group">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control password-input"
              required
              @paste.prevent
            />
            <button
              type="button"
              class="btn eye-button"
              @click="toggleShowPassword"
            >
              <img
                :src="
                  showPassword
                    ? require('@/assets/eye-off.svg')
                    : require('@/assets/eye-on.svg')
                "
                alt="Toggle Password Visibility"
                class="eye-icon"
              />
            </button>
          </div>
          <div v-if="passwordError" class="invalid-feedback d-block">
            {{ passwordError }}
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
          <label for="confirmPassword" class="form-label"
            >Confirm Password</label
          >
          <div class="input-group">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control password-input"
              :class="{ 'is-invalid': showPasswordError }"
              required
              @paste.prevent
            />
            <button
              type="button"
              class="btn eye-button"
              @click="toggleShowConfirmPassword"
            >
              <img
                :src="
                  showConfirmPassword
                    ? require('@/assets/eye-off.svg')
                    : require('@/assets/eye-on.svg')
                "
                alt="Toggle Password Visibility"
                class="eye-icon"
              />
            </button>
          </div>
          <div v-if="showPasswordError" class="text-danger mt-1">
            Passwords do not match.
          </div>
        </div>

        <!-- First Name -->
        <div class="mb-3">
          <label for="nome" class="form-label">First Name</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            class="form-control"
            required
          />
        </div>

        <!-- Last Name -->
        <div class="mb-3">
          <label for="cognome" class="form-label">Last Name</label>
          <input
            id="cognome"
            v-model="form.cognome"
            type="text"
            class="form-control"
            required
          />
        </div>

        <!-- Birth Date -->
        <div class="mb-3">
          <label for="data" class="form-label">Birth Date</label>
          <input
            id="data"
            v-model="form.data"
            type="date"
            class="form-control"
            required
          />
        </div>

        <!-- Phone Number -->
        <div class="mb-3">
          <label for="telefono" class="form-label">Phone Number</label>
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

        <!-- CAP Code -->
        <div class="mb-3">
          <label for="cap_code" class="form-label">CAP Code</label>
          <input
            id="cap_code"
            v-model="form.cap_code"
            type="text"
            class="form-control"
            required
          />
        </div>

        <!-- Tax Code -->
        <div class="mb-3">
          <label for="tax_code" class="form-label">Tax Code</label>
          <input
            id="tax_code"
            v-model="form.tax_code"
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
        confirmPassword: "",
        nome: "",
        cognome: "",
        data: "",
        telefono: "",
        gender: "",
        address: "",
        cap_code: "", // Campo aggiunto per il CAP
        tax_code: "", // Campo aggiunto per il Tax Code
      },
      errors: {},
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      passwordError: "",
      showPasswordError: false, // Aggiunta della variabile per mostrare errore di conferma
    };
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async onSubmit() {
      this.loading = true;
      this.errors = {};
      this.passwordError = "";
      this.showPasswordError = false; // Resetta l'errore

      // Controllo delle password
      if (this.form.password !== this.form.confirmPassword) {
        this.showPasswordError = true; // Mostra errore
      } else {
        this.showPasswordError = false; // Nascondi errore
      }

      // Se le password non corrispondono, interrompi l'invio
      if (this.showPasswordError) {
        this.loading = false;
        return;
      }

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
          cap_code, // Aggiunto cap_code
          tax_code, // Aggiunto tax_code
        } = this.form;

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
          cap_code, // Aggiunto cap_code
          tax_code, // Aggiunto tax_code
        });

        const response = await axios.post("http://127.0.0.1:5000/register", {
          username,
          email,
          password,
          nome,
          cognome,
          data,
          telefono,
          gender,
          address,
          cap_code, // Includere cap_code nella richiesta
          tax_code, // Includere tax_code nella richiesta
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
  background-color: transparent; /* Imposta lo sfondo del pulsante come trasparente */
  border: none; /* Rimuovi il bordo del pulsante */
  transition: background-color 0.3s, transform 0.3s;
}

/* Eye icon styling */
.input-group {
  display: flex; /* Rendi il gruppo di input un contenitore flessibile */
  align-items: center; /* Allinea gli elementi verticalmente */
}

.eye-icon {
  width: 24px; /* Regola la dimensione come necessario */
  height: 24px; /* Regola la dimensione come necessario */
}

.password-input {
  height: calc(2.25rem + 2px); /* Mantieni l'altezza con altri campi di input */
  border-top-right-radius: 0; /* Rimuovi il bordo arrotondato a destra per connettere con il pulsante */
  border-bottom-right-radius: 0; /* Rimuovi il bordo arrotondato a destra per connettere con il pulsante */
}

.eye-button {
  height: calc(
    2.25rem + 2px
  ); /* Allinea l'altezza del pulsante con il campo di input */
  width: 40px; /* Regola la larghezza del pulsante */
  border-top-left-radius: 0; /* Rimuovi il bordo arrotondato a sinistra per connettere con l'input */
  border-bottom-left-radius: 0; /* Rimuovi il bordo arrotondato a sinistra per connettere con l'input */
  display: flex; /* Rendi il pulsante un contenitore flessibile */
  align-items: center; /* Allinea l'icona verticalmente al centro */
  justify-content: center; /* Centra l'icona orizzontalmente */
  padding: 0; /* Rimuovi il padding predefinito */
  margin-top: 0px; /* Sposta il pulsante verso l'alto */
}

.eye-button:hover {
  background-color: rgba(
    211,
    211,
    211,
    0.5
  ); /* Colore grigio al passaggio del mouse */
  transform: scale(
    1.05
  ); /* Aggiungi un effetto di ingrandimento se desiderato */
}

.btn-primary {
  background-color: #007bff; /* Colore del pulsante principale */
  color: white; /* Colore del testo del pulsante */
}

.btn-primary:hover {
  background-color: #0056b3; /* Colore al passaggio del mouse per il pulsante principale */
}
</style>
