<template>
  <div class="calendar-container">
    <!-- Aggiungi qui il calendario e altre funzionalità -->
    <h1>Calendario Attività</h1>
  </div>
</template>

<script>
export default {
  name: "ActivityCalendar",
  data() {
    return {
      // Inizializza altre proprietà se necessarie
    };
  },
  mounted() {
    // Verifica il ruolo dell'utente loggato e stampa il messaggio in base al ruolo
    const userRole = localStorage.getItem("userRole"); // Supponiamo che il ruolo sia salvato in localStorage

    if (userRole === "doctor") {
      console.log("Sono un medico");
    } else if (userRole === "patient") {
      console.log("Sono un paziente");
    } else {
      console.log("Ruolo utente non identificato");
    }
  },
};
</script>

<style scoped>
#calendar {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
</style>
