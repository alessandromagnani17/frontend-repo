<template>
  <div class="reset-password">
    <div class="container mt-5">
      <h2 class="mb-4" v-if="!successMessage">Reimposta la tua password</h2>
      <h2 class="mb-4" v-if="successMessage">{{ successMessage }}</h2>

      <p v-if="errorMessage" class="text-danger mt-1">{{ errorMessage }}</p>

      <div v-if="!successMessage">
        <!-- Campo per la nuova password -->
        <label for="new-password">Inserisci la nuova password:</label>
        <div class="input-group mt-2">
          <input
            id="new-password"
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            :class="{
              'is-invalid':
                !isPasswordValid && passwordInputTouched && newPassword !== '',
            }"
            required
            @input="passwordInputTouched = true"
            placeholder="Nuova password"
            :disabled="confirmPassword !== ''"
          />
          <button
            type="button"
            class="btn eye-button"
            @click="toggleShowPassword"
          >
            <img
              :src="showPassword ? eyeOffIcon : eyeOnIcon"
              alt="Toggle Password Visibility"
              class="eye-icon"
            />
          </button>
        </div>
        <div
          v-if="!isPasswordValid && passwordInputTouched && newPassword !== ''"
          class="text-danger mt-1"
        >
          La password deve contenere almeno 8 caratteri, una lettera maiuscola,
          una minuscola, un numero e un carattere speciale.
        </div>

        <!-- Campo per la conferma della password -->
        <div v-if="isPasswordValid">
          <label for="confirm-password" class="mt-3"
            >Conferma la password:</label
          >
          <div class="input-group mt-2">
            <input
              id="confirm-password"
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              :class="{
                'is-invalid':
                  confirmPasswordTouched &&
                  !isPasswordsMatch &&
                  confirmPassword !== '',
              }"
              required
              @input="confirmPasswordTouched = true"
              placeholder="Conferma la password"
            />
            <button
              type="button"
              class="btn eye-button"
              @click="toggleShowConfirmPassword"
            >
              <img
                :src="showConfirmPassword ? eyeOffIcon : eyeOnIcon"
                alt="Toggle Confirm Password Visibility"
                class="eye-icon"
              />
            </button>
          </div>
          <div
            v-if="
              confirmPasswordTouched &&
              !isPasswordsMatch &&
              confirmPassword !== ''
            "
            class="text-danger mt-1"
          >
            Le password non corrispondono.
          </div>
        </div>

        <button
          class="btn btn-primary mt-4"
          @click="updatePassword"
          :disabled="!isPasswordsMatch"
        >
          Aggiorna Password
        </button>
      </div>

      <div class="btn-group mt-4" v-if="successMessage">
        <button class="btn btn-primary btn-next" @click="goToLogin">
          Esegui il login
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPassword } from "@/services/api-service";
import eyeOn from "@/assets/eye-on.svg";
import eyeOff from "@/assets/eye-off.svg";

export default {
  name: "ResetPassword",
  data() {
    return {
      successMessage: null,
      errorMessage: null,
      isLoading: false,
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      passwordInputTouched: false,
      confirmPasswordTouched: false,
      eyeOnIcon: eyeOn,
      eyeOffIcon: eyeOff,
    };
  },
  computed: {
    isPasswordValid() {
      if (!this.newPassword) return false;
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      return regex.test(this.newPassword);
    },
    isPasswordsMatch() {
      return this.newPassword === this.confirmPassword && this.isPasswordValid;
    },
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async updatePassword() {
      if (!this.isPasswordValid) {
        this.errorMessage =
          "La password non soddisfa i requisiti. Correggila prima di procedere.";
        return;
      }

      try {
        this.isLoading = true;
        await resetPassword(this.$route.params.uid, this.newPassword);

        this.successMessage =
          "La tua password è stata aggiornata con successo!";
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage =
          error.response?.data?.error ||
          "Errore durante l'aggiornamento della password.";
        this.successMessage = null;
      } finally {
        this.isLoading = false;
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.form-control {
  background: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px;
}

.reset-password {
  background: #ffffff; /* Sfondo bianco, simile alla pagina di login */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0); /* Rimuove ombre esterne */
}

.container {
  max-width: 80%;
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
  color: white;
  padding: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 80%;
  max-width: 300px;
  min-width: 200px;
  font-size: 13px;
  transition: background-color 0.3s ease;
  text-align: center;
  display: inline-block;
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

.eye-button {
  background: transparent;
  border: 1px solid #ccc;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  width: 46px;
}

.eye-icon {
  width: 18px;
  height: 18px;
  margin: auto;
}
</style>
