<template>
  <div class="radiograph-list">
    <h2>Radiografie di {{ patientName }}</h2>
    <ul v-if="radiographs.length">
      <li
        v-for="radiograph in radiographs"
        :key="radiograph.id"
        class="radiograph-item"
      >
        {{ radiograph.date }} -
        <a :href="radiograph.url" target="_blank" class="view-link"
          >Visualizza</a
        >
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
  margin: 20px auto;
}

h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li.radiograph-item {
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
  font-size: 12px;
  color: #444;
  display: flex;
  justify-content: space-between;
}

.view-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.view-link:hover {
  color: #0056b3;
}

p {
  font-size: 14px;
  color: #666;
  text-align: center;
}
</style>
