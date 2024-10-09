<template>
  <div class="patient-list">
    <h2>Lista dei Pazienti</h2>
    <ul v-if="patients.length">
      <li v-for="patient in patients" :key="patient.id">
        {{ patient.name }} - {{ patient.id }}
      </li>
    </ul>
    <p v-else>Nessun paziente associato.</p>
  </div>
</template>

<script>
export default {
  name: "PatientList",
  data() {
    return {
      patients: [],
    };
  },
  mounted() {
    // Simulazione di un'API che recupera i pazienti
    this.patients = [
      { id: "123", name: "Mario Rossi" },
      { id: "456", name: "Luca Bianchi" },
    ];
  },
};
</script>

<style scoped>
.patient-list {
  max-width: 800px;
  margin: auto;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
</style>
