<template>
  <div class="welcome">
    <div class="container mt-5">
      <h2 class="mb-4">Benvenuto, {{ fullName }}!</h2>
      <p>Hai effettuato correttamente l'accesso al Radiology Portal.</p>
      <div class="btn-group mt-4">
        <button class="btn btn-primary btn-next" @click="goToDashboard">
          Vai alla Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "WelcomePage",
  setup() {
    const name = ref("");
    const familyName = ref("");
    const userId = ref("");
    const role = ref("");
    const router = useRouter();

    onMounted(() => {
      const userDataString = localStorage.getItem("userData");
      const userData = JSON.parse(userDataString);

      name.value = userData.name;
      familyName.value = userData.family_name;
      userId.value = userData.userId;
      role.value = userData.role;

      // Stampa le informazioni dell'utente nella console
      console.log("Informazioni utente loggato:", userData);
    });

    const fullName = computed(() => `${name.value} ${familyName.value}`);

    const goToDashboard = () => {
      if (role.value === "doctor") {
        router.push({
          name: "DoctorDashboard",
          query: { userId: userId.value },
        });
      } else if (role.value === "patient") {
        router.push({
          name: "PatientDashboard",
          query: { userId: userId.value },
        });
      }
    };

    return { fullName, role, goToDashboard };
  },
};
</script>

<style scoped>
.welcome {
  background: #ffffff; /* Sfondo bianco */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center; /* Centra verticalmente */
}

.container {
  max-width: 80%;
  width: 100%; /* Imposta una larghezza del 100% */
  padding: 40px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); /* Ombra del contenitore */
  margin-top: 100px;
  text-align: center; /* Centra il testo */
  flex-grow: 1; /* Permette al contenuto di occupare lo spazio rimanente */
  margin-left: auto; /* Margini automatici per centrare orizzontalmente */
  margin-right: auto; /* Margini automatici per centrare orizzontalmente */
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
  width: 100%;
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
</style>
