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

          <router-link
            to="/register"
            class="btn btn-light btn-create-account"
            @click="createAccount('doctor')"
          >
            Registrati come Dottore
          </router-link>

          <router-link
            to="/register"
            class="btn btn-light btn-create-account"
            @click="createAccount('patient')"
          >
            Registrati come Paziente
          </router-link>
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
            <div v-if="errors.general" class="text-danger mt-1">
              {{ errors.general }}
            </div>
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

          <router-link
            to="/register"
            class="btn btn-light btn-create-account"
            @click="createAccount('doctor')"
          >
            Registrati come Dottore
          </router-link>

          <router-link
            to="/register"
            class="btn btn-light btn-create-account"
            @click="createAccount('patient')"
          >
            Registrati come Paziente
          </router-link>

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
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import EventBus from "../eventBus";

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

    const sendPasswordResetEmailHandler = async () => {
      try {
        await sendPasswordResetEmail(auth, form.value.email); // Passa l'oggetto auth come primo argomento
        alert("Un'email per reimpostare la password è stata inviata.");
      } catch (error) {
        console.error("Errore durante l'invio dell'email di reset:", error);
        errors.value.general = "Errore durante l'invio dell'email di reset.";
      }
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

        if (!user.emailVerified) {
          console.log("Email NON verificata");
          errors.value.general =
            "La tua email non è stata verificata. Verifica la tua email prima di accedere.";
          loading.value = false;
          return;
        } else {
          console.log("Email verificata");
        }

        // Ottieni il token ID
        const token = await user.getIdToken();

        // Invia il token al backend
        const response = await axios.post("http://127.0.0.1:5000/login", {
          idToken: token,
        });

        if (response.data.message === "Login successful") {
          const userData = response.data.user;
          console.log("User Data:  ", userData);

          localStorage.setItem("authToken", token);
          localStorage.setItem("username", user.email);

          // Controlla e setta il ruolo e il doctorId se presenti
          if (userData.doctorID) {
            localStorage.setItem("doctorId", userData.doctorID);
          }

          if (userData.role) {
            localStorage.setItem("userRole", userData.role);
          }

          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          console.log("Redirecting to WelcomePage");
          localStorage.setItem("userData", JSON.stringify(userData));

          // Emmetti un evento per notificare il login
          EventBus.emit("auth-changed");
          router.push({ name: "WelcomePage" });
        }
      } catch (error) {
        console.error("Errore durante il processo di login:", error);
        // Azzera gli errori generali
        errors.value.general = "";

        // Controllo per credenziali non valide
        if (error.code === "auth/wrong-password") {
          errors.value.general = "Password errata. Riprova.";
        } else if (error.code === "auth/user-not-found") {
          errors.value.general = "Utente non trovato. Controlla l'email.";
        } else if (error.code === "auth/invalid-credential") {
          console.log(
            "Inviando l'email per decrementare i tentativi..." +
              form.value.email
          );
          try {
            // Invia l'email al server per decrementare i tentativi
            console.log("Email inviata al server:", form.value.email);
            const decrementResponse = await axios.post(
              "http://127.0.0.1:5000/decrement-attempts",
              {
                email: form.value.email,
              }
            );

            if (decrementResponse.data.message) {
              errors.value.general = decrementResponse.data.message;
            } else {
              // Aggiorna il numero di tentativi rimanenti se il decremento è avvenuto con successo
              const attemptsRemaining =
                decrementResponse.data.loginAttemptsLeft;
              errors.value.general = `Password errata. Hai ${attemptsRemaining} tentativi rimanenti.`;
            }
          } catch (decrementError) {
            console.error(
              "Errore durante il decremento dei tentativi:",
              decrementError
            );
            errors.value.general = "Errore nel decremento dei tentativi.";
          }
        } else if (error.code === "auth/too-many-requests") {
          errors.value.general =
            "Tentativi di accesso esauriti. Controlla la tua email per il link di reimpostazione della password.";
          await sendPasswordResetEmailHandler();
        } else if (error.response.status === 403) {
          console.log("ENTRO QUAAAAA");
          errors.value.general =
            "La tua email non è stata verificata. Verifica la tua email prima di accedere.";
        } else {
          errors.value.general = "Errore sconosciuto durante il login.";
        }

        console.log("Messaggio di errore generale:", errors.value.general);
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

.text-danger {
  font-size: 0.8rem; /* Font più piccolo (puoi modificarlo a piacere) */
}
</style>
