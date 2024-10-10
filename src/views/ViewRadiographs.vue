<template>
  <div class="view-radiographs">
    <div class="container mt-5">
      <h2 class="mb-4">
        Benvenuto nella Pagina di Visualizzazione delle Radiografie!
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewRadiographs",
};
</script>

<style scoped>
.view-radiographs {
  background: #ffffff; /* Sfondo bianco, simile alla pagina di login */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0); /* Rimuove ombre esterne */
}

.container {
  max-width: 600px;
  padding: 40px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); /* Simile alla shadow del login */
  margin-top: 100px;
  height: auto;
  text-align: center; /* Centra il testo */
}

h2 {
  font-size: 18px; /* Uniforma il font size al login */
  margin-bottom: 30px;
}
</style>
