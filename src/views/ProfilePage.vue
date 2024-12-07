<template>
  <div class="profile">
    <div class="container mt-5">
      <h1>Benvenuto nel tuo Profilo!</h1>
      <div class="user-info">
        <div v-for="(value, key) in displayFields" :key="key" class="user-item">
          <p>
            <strong>{{ value.label }}:</strong>
            <span v-if="!editingField[key]">{{ userData[key] }}</span>
            <input
              v-else
              type="text"
              v-model="editableValues[key]"
              class="edit-input"
            />
            <button
              v-if="!editingField[key]"
              class="btn-edit"
              @click="startEditing(key)"
            >
              <img src="@/assets/modify.svg" alt="Modifica" class="edit-icon" />
            </button>
            <button v-else class="btn-save" @click="saveField(key)">
              Salva
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfilePage",
  data() {
    return {
      userData: {},
      editingField: {},
      editableValues: {},
      displayFields: {
        name: { label: "Nome" },
        family_name: { label: "Cognome" },
        username: { label: "Username" },
        email: { label: "Email" },
        birthdate: { label: "Data di Nascita" },
        phone_number: { label: "Telefono" },
        address: { label: "Indirizzo" },
        cap_code: { label: "CAP" },
        gender: { label: "Genere" },
        tax_code: { label: "Codice Fiscale" },
      },
    };
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.userId;
      if (!userId) {
        console.error("ID utente non definito");
        return;
      }

      fetch(`http://localhost:5000/api/get_user/${userId}`)
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject("Errore nel recupero dei dati utente")
        )
        .then((data) => {
          this.userData = data;
          this.resetEditableValues();
        })
        .catch((error) => {
          console.error("Errore:", error);
          alert(
            "Si è verificato un errore durante il caricamento dei dati utente."
          );
        });
    },
    resetEditableValues() {
      Object.keys(this.displayFields).forEach((key) => {
        this.editableValues[key] = this.userData[key];
        this.editingField[key] = false;
      });
    },
    startEditing(field) {
      this.editingField[field] = true;
    },
    saveField(field) {
      const newValue = this.editableValues[field];
      if (newValue !== this.userData[field]) {
        this.updateUserData(field, newValue);
      }
      this.editingField[field] = false;
    },
    updateUserData(field, value) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.userId;
      if (!userId) {
        alert("Si è verificato un errore, l'ID utente non è disponibile.");
        return;
      }

      fetch("http://localhost:5000/update_user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, [field]: value }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Errore nel salvataggio dei dati");
          alert("Informazione aggiornata con successo!");
          this.loadUserData();
        })
        .catch((error) => {
          console.error("Errore:", error);
          alert("Si è verificato un errore durante l'aggiornamento.");
        });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  padding: 40px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
  height: auto;
  text-align: left;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.user-info {
  font-size: 14px;
  line-height: 1.5;
}

.user-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.user-item strong {
  margin-right: 5px;
}

.btn-edit {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 5px;
}

.edit-icon {
  width: 30px;
  height: 30px;
  margin-left: 5px;
  vertical-align: middle;
}

.edit-input {
  padding: 5px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.btn-save {
  background-color: #007bff;
  color: white;
  padding: 0.3rem;
  border-radius: 5px;
  cursor: pointer;
  min-width: 80px;
}

.btn-save:hover {
  background-color: #0056b3;
}
</style>
