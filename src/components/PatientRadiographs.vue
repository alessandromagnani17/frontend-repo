<template>
  <div class="radiograph-list">
    <h2>Radiografie di {{ patientName }}</h2>
    <ul v-if="radiographs.length">
      <li v-for="radiograph in radiographs" :key="radiograph.id">
        {{ radiograph.date }} -
        <a :href="radiograph.url" target="_blank">Visualizza</a>
      </li>
    </ul>
    <p v-else>Nessuna radiografia trovata per questo paziente.</p>
  </div>
</template>

<script>
export default {
  name: "PatientRadiographs",
  props: {
    patientId: {
      type: String,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      radiographs: [],
    };
  },
  mounted() {
    // Simulazione di un'API che recupera le radiografie di un paziente
    this.radiographs = [
      {
        id: "1",
        date: "2024-01-10",
        url: "https://example.com/radiograph1.jpg",
      },
      {
        id: "2",
        date: "2024-02-15",
        url: "https://example.com/radiograph2.jpg",
      },
    ];
  },
};
</script>

<style scoped>
.radiograph-list {
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
