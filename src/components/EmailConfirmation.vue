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

      <span class="step-title">Passaggio {{ currentStep }} di 1</span>
      <h2 class="mb-4">Conferma il tuo Account</h2>

      <form @submit.prevent="onSubmit">
        <div v-if="currentStep === 1">
          <div class="mb-3">
            <label for="confirmationCode" class="form-label"
              >Codice di conferma</label
            >
            <input
              id="confirmationCode"
              v-model="form.confirmationCode"
              type="text"
              class="form-control"
              required
            />
          </div>
        </div>

        <div v-if="currentStep === 1">
          <button
            type="submit"
            class="btn btn-primary btn-next"
            :disabled="loading || !isStepValid(currentStep)"
          >
            <span v-if="loading">Conferma...</span>
            <span v-else>Conferma il Codice</span>
          </button>

          <div v-if="errors.general" class="invalid-feedback mt-3">
            {{ errors.general }}
          </div>
        </div>
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
import axios from "axios";

export default {
  data() {
    return {
      currentStep: 1,
      loading: false,
      errors: {},
      form: {
        confirmationCode: "",
      },
      email: this.$route.params.email,
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      this.errors = {};
      console.log("Inizio invio dati...");

      const requestData = {
        email: this.email,
        confirmation_code: this.form.confirmationCode,
      };

      console.log("Dati inviati:", requestData);

      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/confirm",
          requestData
        );

        console.log("Risposta del server:", response.data);

        if (response.data.message === "Email confirmed successfully.") {
          alert("Successo: Email confermata.");
          this.$router.push("/login");
        } else {
          this.handleError(response.data.error || "Errore sconosciuto");
        }
      } catch (error) {
        console.error("Errore di conferma:", error);
        if (error.response) {
          console.error("Dati della risposta di errore:", error.response.data);
          this.handleError(
            error.response.data.message ||
              error.response.data.error ||
              "Errore nella conferma"
          );
        } else {
          this.handleError("Errore di rete. Verifica la tua connessione.");
        }
      } finally {
        this.loading = false;
      }
    },
    handleError(errorMessage) {
      this.errors.general = errorMessage;
      alert("Errore: " + errorMessage);
    },
    isStepValid() {
      return this.form.confirmationCode.length > 0;
    },
  },
};
</script>

<style scoped>
/* Lo stile è lo stesso della pagina di registrazione */
.register {
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
</style>
