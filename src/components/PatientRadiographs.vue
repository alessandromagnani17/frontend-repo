<template>
  <div class="radiograph-list">
    <h2>Radiografie di {{ patientName }}</h2>
    <ul v-if="radiographs.length">
      <li
        v-for="radiograph in radiographs"
        :key="radiograph.name"
        class="radiograph-item"
      >
        <div>
          {{ radiograph.date }} -
          <button @click="toggleRadiograph(radiograph)" class="view-link">
            Visualizza
          </button>
        </div>

        <!-- Se l'immagine è selezionata, mostriamo l'anteprima -->
        <div
          v-if="selectedRadiograph === radiograph"
          class="radiograph-preview"
        >
          <!-- Aggiungiamo una classe che gestisce l'animazione (sliding up/down) -->
          <div
            class="content-with-animation"
            :class="{ 'slide-down': isSlidingDown, 'slide-up': isSlidingUp }"
          >
            <img
              :src="radiograph.url"
              alt="Radiografia"
              class="radiograph-image"
              v-if="isImageVisible"
            />
          </div>
          <div class="radiograph-controls">
            <button
              @click="enlargeRadiograph(radiograph.url)"
              class="control-button"
            >
              <img src="@/assets/zoom.svg" alt="Zoom" class="icon" />
            </button>
            <a :href="radiograph.url" download class="control-button">
              <img src="@/assets/download.svg" alt="Download" class="icon" />
            </a>
          </div>
        </div>
      </li>
    </ul>
    <p v-else>Nessuna radiografia trovata per questo paziente.</p>

    <!-- Modale per ingrandire l'immagine -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close-button">&times;</span>
        <img
          :src="modalImageUrl"
          alt="Immagine ingrandita"
          class="modal-image"
        />
        <button @click="closeModal" class="close-button">Rimpicciolisci</button>
      </div>
    </div>
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
      selectedRadiograph: null, // Per tracciare quale radiografia è stata selezionata
      isModalOpen: false, // Stato per il modale
      modalImageUrl: "", // URL dell'immagine ingrandita
      isImageVisible: false, // Stato per la visibilità dell'immagine
      isSlidingDown: false, // Stato per l'animazione di apertura
      isSlidingUp: false, // Stato per l'animazione di chiusura
    };
  },
  async mounted() {
    try {
      const response = await fetch(
        `/api/patients/${this.patientId}/radiographs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        this.radiographs = await response.json();
      } else {
        console.error("Errore nel recupero delle radiografie.");
      }
    } catch (error) {
      console.error("Errore:", error);
    }
  },
  methods: {
    toggleRadiograph(radiograph) {
      if (this.selectedRadiograph === radiograph) {
        // Se l'immagine è già selezionata, esegui l'animazione di chiusura
        this.isSlidingDown = false; // Disattiviamo l'animazione di apertura
        this.isSlidingUp = true; // Inizio dell'animazione di chiusura
        setTimeout(() => {
          this.isImageVisible = false; // Nascondiamo l'immagine dopo l'animazione
          this.selectedRadiograph = null; // Deselezioniamo la radiografia
          this.isSlidingUp = false; // Reset dello stato dell'animazione di chiusura
        }, 300); // Ritardo per permettere il completamento dell'animazione
      } else {
        // Seleziona l'immagine e esegui l'animazione di apertura
        this.selectedRadiograph = radiograph;
        this.isSlidingUp = false; // Disattiviamo l'animazione di chiusura
        this.isSlidingDown = true; // Inizio dell'animazione di apertura
        setTimeout(() => {
          this.isImageVisible = true; // Mostriamo l'immagine dopo l'animazione
        }, 300); // Leggero ritardo per garantire la transizione CSS
      }
    },
    enlargeRadiograph(url) {
      // Apri il modale e mostra l'immagine ingrandita
      this.modalImageUrl = url;
      this.isModalOpen = true;
    },
    closeModal() {
      // Chiudi il modale
      this.isModalOpen = false;
    },
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
  flex-direction: column;
}

.view-link {
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: color 0.5s ease; /* Animazione più lenta */
  padding: 0;
  margin: 0;
}

.view-link:hover {
  color: #0056b3;
}

.radiograph-preview {
  margin-top: 10px;
}

.radiograph-image {
  width: 100%;
  max-width: 400px;
  display: block;
  margin-bottom: 10px;
}

/* Sezione per l'animazione */
.content-with-animation {
  overflow: hidden;
  transition: max-height 0.3s ease, transform 0.3s ease; /* Aggiunta della trasformazione */
  max-height: 0; /* Impostazione predefinita: l'immagine è nascosta */
  transform: translateY(
    -20px
  ); /* Spostiamo l'immagine verso l'alto come stato iniziale */
}

/* Classe per l'animazione di apertura (mostrare l'immagine) */
.content-with-animation.slide-down {
  max-height: 400px; /* Consente il display completo dell'immagine */
  transform: translateY(0); /* L'immagine scende dall'alto */
}

/* Classe per l'animazione di chiusura (nascondere l'immagine) */
.content-with-animation.slide-up {
  max-height: 0; /* Ritorna alla modalità nascosta */
}

.radiograph-controls {
  display: flex;
  justify-content: flex-end;
}

.control-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 10px;
}

.icon {
  width: 24px; /* Dimensione dell'icona */
  height: 24px; /* Dimensione dell'icona */
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  position: relative;
  max-width: 80%;
  max-height: 80%;
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.modal-image {
  max-width: 100%;
  max-height: 70vh;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
}
</style>
