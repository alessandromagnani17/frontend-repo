<template>
  <div class="login">
    <div class="container mt-5">
      <div class="header">
        <button
          v-if="currentStep > 1"
          class="back-button"
          @click="goToPreviousStep"
        >
          <img src="@/assets/back-icon.svg" alt="Indietro" class="back-icon" />
        </button>
      </div>

      <span class="step-title">Passaggio {{ currentStep }} di 2</span>
      <h2 class="mb-4">Accedi al tuo Account</h2>

      <!-- Step 1: Login Form -->
      <form @submit.prevent="onSubmit" v-if="!showMfaStep">
        <!-- Step 1: Inserisci Email -->
        <div v-if="currentStep === 1">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              required
            />
            <div class="invalid-feedback">{{ errors.email }}</div>
          </div>

          <button
            type="button"
            class="btn btn-primary btn-next"
            @click="goToNextStep"
            :disabled="!isStepValid(currentStep)"
          >
            Avanti
          </button>

          <div class="line-container">
            <hr class="line" />
            <span class="or-text">oppure</span>
            <hr class="line" />
          </div>

          <button
            type="button"
            class="btn btn-light btn-create-account"
            @click="createAccount"
          >
            Crea un Account
          </button>
        </div>

        <!-- Step 2: Inserisci Password -->
        <div v-if="currentStep === 2">
          <div class="email-display">
            <span class="email-text">{{ form.email }}</span>
            <span class="change-text" @click="goToPreviousStep">Cambia</span>
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                required
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
            <div class="invalid-feedback">{{ errors.password }}</div>
          </div>

          <div class="mb-3 form-check">
            <input
              id="rememberMe"
              v-model="form.rememberMe"
              type="checkbox"
              class="form-check-input"
            />
            <label for="rememberMe" class="form-check-label">Ricordami</label>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-next"
            :disabled="loading || !isStepValid(currentStep)"
          >
            <span v-if="loading">Login...</span>
            <span v-else>Accedi</span>
          </button>

          <div class="line-container">
            <hr class="line" />
            <span class="or-text">oppure</span>
            <hr class="line" />
          </div>

          <button
            type="button"
            class="btn btn-light btn-create-account"
            @click="createAccount"
          >
            Crea un Account
          </button>

          <div v-if="errors.general" class="invalid-feedback mt-3">
            {{ errors.general }}
          </div>
        </div>
      </form>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-icon">
        <img src="@/assets/loading-icon.svg" alt="Loading..." />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth"; // Importa il modulo di autenticazione

export default {
  name: "UserLogin",
  setup() {
    // Stato del form
    const form = ref({
      email: "",
      password: "",
      rememberMe: false,
    });

    // Stato degli errori
    const errors = ref({
      email: "",
      password: "",
      general: "",
    });

    const router = useRouter();
    const currentStep = ref(1);
    const loading = ref(false);
    const showPassword = ref(false);
    const showMfaStep = ref(false); // Toggle MFA step visibility
    const qrCodeUrl = ref(""); // Store QR code URL
    const session = ref(""); // Store MFA session token
    const mfaCode = ref(""); // Store user input MFA code

    // Funzione per passare allo step successivo
    const goToNextStep = () => {
      if (isStepValid(currentStep.value)) {
        currentStep.value++;
      }
    };

    // Funzione per tornare allo step precedente
    const goToPreviousStep = () => {
      currentStep.value--;
    };

    // Funzione per creare un account (stub)
    const createAccount = () => {
      router.push({ name: "UserRegister" });
    };

    // Funzione per validare il form
    const validateForm = () => {
      errors.value = {
        email: form.value.email ? "" : "Email è richiesta",
        password: form.value.password ? "" : "Password è richiesta",
      };
      return Object.values(errors.value).every((error) => !error);
    };

    // Funzione per validare lo step
    const isStepValid = (step) => {
      if (step === 1) {
        return form.value.email;
      } else if (step === 2) {
        return form.value.password;
      }
      return false;
    };

    // Funzione per mostrare/nascondere la password
    const toggleShowPassword = () => {
      showPassword.value = !showPassword.value;
    };

    const onSubmit = async () => {
      console.log("Attempting login...");
      if (!validateForm()) return;
      loading.value = true;

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          form.value.email,
          form.value.password
        );
        const user = userCredential.user;

        console.log("Login successful:", user);

        // Ottieni il token ID
        const token = await user.getIdToken();

        // Invia il token al backend
        const response = await axios.post("http://127.0.0.1:5000/login", {
          idToken: token,
        });

        console.log("Responseeessss --> " + JSON.stringify(response, null, 2));

        if (response.data.message === "Login successful") {
          localStorage.setItem("authToken", token);
          localStorage.setItem("username", user.email);
          if (response.data.role) {
            console.log("SETTO RUOLO");
            localStorage.setItem("userRole", response.data.role);
          } else {
            console.log("NON SENTTO ROLE");
          }
          if (response.data.doctorId) {
            // Aggiungere controllo SE PAZIENTE O DOTTORE
            console.log("SETTO ID");
            localStorage.setItem("doctorId", response.data.doctorId);
          } else {
            console.log("NON SENTTO ID");
          }
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const username = user.email; // O user.uid
          console.log("Redirecting to WelcomePage with username:", username);
          router.push({ name: "WelcomePage" });
        }
      } catch (error) {
        console.error("Error during login process:", error);
        errors.value.general =
          error.response?.data?.error || "Unknown login error.";
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      errors,
      currentStep,
      loading,
      showPassword,
      showMfaStep,
      qrCodeUrl,
      session,
      mfaCode,
      goToNextStep,
      goToPreviousStep,
      createAccount,
      validateForm,
      isStepValid,
      toggleShowPassword,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.login {
  background: #ffffff; /* Sfondo bianco */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0);
}

.container {
  max-width: 400px;
  padding: 40px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
  height: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-button {
  background: transparent;
  border: none;
  cursor: pointer;
  margin-left: -10px;
}

.back-icon {
  width: 30px;
  height: 30px;
}

.step-title {
  font-size: 10px;
  margin-bottom: 10px;
}

h2 {
  font-size: 18px;
  margin-bottom: 30px;
}

.form-label {
  font-size: 12px;
}

.form-control {
  background: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px;
}

.form-check-label {
  font-size: 12px; /* Dimensione del testo più piccola */
}

.form-check-input {
  transform: scale(0.75); /* Riduce la dimensione della checkbox di poco */
  margin-top: 5px; /* Sposta leggermente la checkbox verso il basso per allineamento */
}

.input-group {
  position: relative;
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

.btn-next {
  width: 100%;
  margin-top: 10px;
  padding: 0.4rem;
  cursor: pointer;
}

.line-container {
  display: flex;
  align-items: center;
  margin: 1rem 0;
}

.line {
  flex: 1;
}

.or-text {
  margin: 0 1rem;
  font-size: small;
}

.btn-create-account {
  background: #d9d9d9; /* Colore grigio chiaro */
  color: black; /* Colore del testo */
  width: 100%;
  margin-top: 15px; /* Spazio sopra il pulsante */
  padding: 0.4rem; /* Ridotto per i pulsanti, più corto verticalmente */
  font-size: 13px; /* Dimensione del testo più piccola */
}

.btn-next {
  font-size: 13px; /* Dimensione del testo più piccola per il pulsante "Avanti" */
}

.email-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.email-text {
  font-size: 14px; /* Dimensione testo per l'email */
  color: black; /* Colore del testo */
}

.change-text {
  font-size: 14px; /* Dimensione testo per "Cambia" */
  color: black; /* Colore del testo */
  text-decoration: underline; /* Sottolinea il testo */
  cursor: pointer; /* Aggiunge il cursore pointer */
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-icon {
  width: 50px;
  height: 50px;
}
</style>
