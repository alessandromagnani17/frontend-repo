<template>
  <div class="register">
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

      <span class="step-title">Passaggio {{ currentStep }} di 3</span>
      <h2 class="mb-4">Crea un Account</h2>

      <form @submit.prevent="onSubmit">
        <div v-if="currentStep === 1">
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

          <div class="mb-3">
            <label for="gender" class="form-label">Genere</label>
            <select
              id="gender"
              v-model="form.gender"
              class="form-control"
              required
            >
              <option value="Male">Maschio</option>
              <option value="Female">Femmina</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="data" class="form-label">Data di Nascita</label>
            <input
              id="data"
              v-model="form.data"
              type="date"
              class="form-control"
              required
            />
          </div>
        </div>

        <div v-if="currentStep === 2">
          <div class="mb-3">
            <label for="address" class="form-label">Indirizzo</label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="cap_code" class="form-label">CAP</label>
            <input
              id="cap_code"
              v-model="form.cap_code"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="tax_code" class="form-label">Codice Fiscale</label>
            <input
              id="tax_code"
              v-model="form.tax_code"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="telefono" class="form-label">Numero di Telefono</label>
            <input
              id="telefono"
              v-model="form.telefono"
              type="tel"
              class="form-control"
              required
            />
          </div>
        </div>

        <div v-if="currentStep === 3">
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

          <div class="mb-3">
            <label for="password" class="form-label"
              >Password
              <span
                class="info-icon"
                title="Requisiti per la password: min 8 caratteri, almeno una maiuscola, una minuscola e un numero."
              >
                <img
                  src="@/assets/info-icon.svg"
                  alt="Info"
                  class="info-image"
                />
              </span>
            </label>
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
            <div v-if="showPasswordError" class="text-danger mt-1">
              Le password non corrispondono.
            </div>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label"
              >Conferma Password</label
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
          </div>
        </div>

        <button
          type="button"
          class="btn btn-primary btn-next"
          :disabled="!isStepValid(currentStep)"
          @click="goToNextStep"
          @mouseover="isHover = true"
          @mouseleave="isHover = false"
          @mouseenter="showDisabledIcon = !isStepValid(currentStep)"
        >
          Avanti
          <span
            v-if="!isStepValid(currentStep) && isHover"
            class="disabled-icon"
          >
            <img
              src="@/assets/prohibition-icon.svg"
              alt="Non disponibile"
              class="prohibition-icon"
            />
          </span>
        </button>
      </form>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="loading-icon">
        <img src="@/assets/loading-icon.svg" alt="Loading..." />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 1,
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      showPasswordError: false,
      isHover: false,
      form: {
        nome: "",
        cognome: "",
        gender: "",
        data: "",
        address: "",
        cap_code: "",
        tax_code: "",
        telefono: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    goToNextStep() {
      if (this.isStepValid(this.currentStep)) {
        this.loading = true; // Inizio caricamento
        setTimeout(() => {
          this.currentStep++;
          this.loading = false; // Fine caricamento
        }, 1000); // Simulazione di 1 secondo di caricamento
      }
    },
    goToPreviousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    isStepValid(step) {
      switch (step) {
        case 1: {
          return (
            this.form.nome &&
            this.form.cognome &&
            this.form.gender &&
            this.form.data
          );
        }
        case 2: {
          return (
            this.form.address &&
            this.form.cap_code &&
            this.form.tax_code &&
            this.form.telefono
          );
        }
        case 3: {
          const passwordsMatch =
            this.form.password === this.form.confirmPassword;
          this.showPasswordError = !passwordsMatch;
          return this.form.email && this.form.password && passwordsMatch;
        }
        default:
          return false;
      }
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    toggleShowConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    onSubmit() {
      console.log(this.form);
    },
  },
};
</script>

<style scoped>
.register {
  background: #ffffff; /* Sfondo bianco */
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

.info-icon {
  margin-left: 5px;
  display: inline-block;
}

.info-image {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}

.btn-next {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  cursor: pointer;
}

.btn-next:hover {
  background-color: #c0c0c0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-icon {
  width: 50px;
}

.disabled-icon {
  margin-left: 10px;
}

.prohibition-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  display: inline-block;
}
</style>
