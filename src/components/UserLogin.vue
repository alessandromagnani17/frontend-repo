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

      <form @submit.prevent="onSubmit">
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
        </div>

        <!-- Step 2: Inserisci Password -->
        <div v-if="currentStep === 2">
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
        </div>

        <!-- Bottone di avanzamento o login -->
        <div v-if="currentStep < 2">
          <button
            type="button"
            class="btn btn-primary btn-next"
            @click="goToNextStep"
            :disabled="!isStepValid(currentStep)"
          >
            Avanti
          </button>
        </div>

        <div v-if="currentStep === 2">
          <button
            type="submit"
            class="btn btn-primary btn-next"
            :disabled="loading || !isStepValid(currentStep)"
          >
            <span v-if="loading">Login...</span>
            <span v-else>Accedi</span>
          </button>
          <!-- Error message -->
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
import { ref } from "vue"; // Importa il composable ref da Vue 3
import { useRouter } from "vue-router"; // Importa il router per la navigazione
import axios from "axios"; // Importa axios per fare richieste HTTP

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

    const router = useRouter(); // Inizializza il router
    const currentStep = ref(1);
    const loading = ref(false);
    const showPassword = ref(false);

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

    // Funzione per gestire il submit del form
    const onSubmit = async () => {
      if (!validateForm()) return;
      loading.value = true;

      try {
        // Effettua la richiesta POST per il login usando axios
        const response = await axios.post("/api/login", {
          email: form.value.email,
          password: form.value.password,
        });

        // Simula successo del login
        alert(
          "Login avvenuto con successo! Benvenuto " + response.data.username
        );

        // Naviga alla pagina di benvenuto o dashboard
        router.push({
          name: "Welcome",
          query: { username: form.value.email },
        });
      } catch (error) {
        console.error("Errore di login:", error);
        alert(`Errore di login: ${error.message}`);
        if (error.response) {
          alert(`Status code: ${error.response.status}`);
          alert(`Errore dal server: ${error.response.data}`);
          errors.value.general = `Errore di login: ${
            error.response.data.message || error.response.statusText
          }`;
        } else if (error.request) {
          alert(
            "La richiesta è stata inviata ma non ha ricevuto risposta dal server."
          );
          errors.value.general = "Errore di rete o server non raggiungibile.";
        } else {
          alert("Errore sconosciuto durante la richiesta.");
          errors.value.general = "Errore sconosciuto durante la richiesta.";
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      currentStep,
      loading,
      showPassword,
      toggleShowPassword,
      onSubmit,
      goToNextStep,
      goToPreviousStep,
      isStepValid,
      errors,
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
  max-width: 600px;
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
  margin-top: 20px;
  padding: 10px;
  cursor: pointer;
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
