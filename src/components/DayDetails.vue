<template>
  <transition
    name="fade"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <div v-if="selectedDay" class="day-details">
      <h2>
        Dettagli del Giorno: {{ selectedDay.date }} {{ monthNames[month] }}
        {{ year }}
      </h2>

      <!-- Mostra operazioni pianificate se presenti -->
      <div v-if="selectedDay.operations.length > 0">
        <h3 class="small-b-text">Operazioni pianificate:</h3>
        <ul>
          <li v-for="operation in orderedOperations" :key="operation.id">
            <span class="small-text"
              >Ore: {{ formatTime(operation.operationDate) }}</span
            ><br />
            <span class="small-text"
              >Descrizione: {{ operation.description }}</span
            ><br />
          </li>
        </ul>
      </div>

      <div v-if="selectedDay.radiographs.length > 0">
        <h3 class="small-b-text">Radiografie caricate:</h3>
        <ul class="radiograph-list">
          <li
            v-for="radiograph in selectedDay.radiographs"
            :key="radiograph.name"
            class="radiograph-item"
          >
            <div>
              {{ radiograph.date }} -
              <button @click="toggleRadiograph(radiograph)" class="view-link">
                Visualizza
              </button>
            </div>

            <div
              v-if="selectedRadiograph === radiograph"
              class="radiograph-preview"
            >
              <div
                class="content-with-animation"
                :class="{
                  'slide-down': isSlidingDown,
                  'slide-up': isSlidingUp,
                }"
              >
                <img
                  :src="radiograph.url"
                  alt="Radiografia"
                  class="radiograph-image"
                  v-show="isImageVisible"
                />
              </div>
              <div class="radiograph-controls">
                <button
                  @click="enlargeRadiograph(radiograph.url)"
                  class="control-button"
                >
                  <img src="@/assets/zoom.svg" alt="Zoom" class="icon" />
                </button>
                <a
                  :href="`/api/download-radiograph?url=${encodeURIComponent(
                    radiograph.url
                  )}&filename=radiografia_${radiograph.date}.png`"
                  class="control-button"
                  download
                >
                  <img
                    src="@/assets/download.svg"
                    alt="Download"
                    class="icon"
                  />
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Mostra il messaggio solo se NON ci sono operazioni e radiografie -->
      <div
        v-if="
          selectedDay.operations.length === 0 &&
          selectedDay.radiographs.length === 0
        "
      >
        <p>Non ci sono attività pianificate per questa data.</p>
      </div>

      <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
          <span @click="closeModal" class="close-button">
            <img src="@/assets/cross.svg" alt="Chiudi" class="close-icon" />
          </span>
          <img
            :src="modalImageUrl"
            alt="Immagine ingrandita"
            class="modal-image"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    selectedDay: Object,
    monthNames: Array,
    month: Number,
    year: Number,
    formatDate: Function,
    formatTime: Function,
  },
  data() {
    return {
      selectedRadiograph: null,
      isSlidingDown: false,
      isSlidingUp: false,
      isImageVisible: false,
      isModalOpen: false,
      modalImageUrl: null,
    };
  },
  computed: {
    orderedOperations() {
      return this.selectedDay.operations.slice().sort((a, b) => {
        // Converti la data in millisecondi per confrontarle
        const timeA = new Date(a.operationDate).getTime();
        const timeB = new Date(b.operationDate).getTime();
        return timeA - timeB; // Ordina in ordine crescente
      });
    },
  },
  methods: {
    enlargeRadiograph(url) {
      if (!url) {
        console.error("URL mancante o non valido");
        return;
      }
      this.modalImageUrl = url; // Imposta l'immagine da mostrare nel modale
      this.isModalOpen = true; // Mostra il modale
    },
    closeModal() {
      this.isModalOpen = false; // Chiudi il modale
      this.modalImageUrl = null; // Resetta l'URL
    },
    toggleRadiograph(radiograph) {
      if (this.selectedRadiograph === radiograph) {
        this.isSlidingUp = true;
        this.isSlidingDown = false;
        setTimeout(() => {
          this.selectedRadiograph = null;
          this.isImageVisible = false;
        }, 500); // Il tempo di transizione deve corrispondere a quello del CSS
      } else {
        this.selectedRadiograph = radiograph;
        this.isSlidingDown = true;
        this.isSlidingUp = false;
        this.isImageVisible = true;
      }
    },
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      el.offsetHeight; // Trigger reflow
      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = 1;
      done();
    },
    leave(el, done) {
      el.style.transition = "opacity 0.5s ease";
      el.style.opacity = 0;
      done();
    },
  },
};
</script>

<style scoped>
.day-details {
  margin-top: 50px;
  text-align: left;
  transition: opacity 0.5s ease;
}

.day-details h2 {
  font-size: 1em;
  margin-bottom: 10px;
}

.day-details p {
  font-size: 0.7em;
  margin-bottom: 10px;
}

.day-details ul {
  list-style-type: none;
  padding: 0;
}

.day-details li {
  margin-bottom: 10px;
}

.small-b-text {
  font-size: 0.9rem; /* Puoi regolare la dimensione come preferisci */
  font-weight: 600; /* Opzionale, per mantenere il testo in grassetto */
}

.small-text {
  font-size: 0.8rem; /* Puoi regolare la dimensione come preferisci */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.radiograph-list {
  max-width: 800px;
  margin: 20px auto;
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
  transition: color 0.5s ease;
  padding: 0;
  margin: 0;
}

.view-link:hover {
  color: #0056b3;
}

.radiograph-preview {
  margin-top: 15px;
  width: 95%;
  align-self: center;
}

.radiograph-image {
  width: 80%;
  display: block;
  margin-bottom: 10px;
}

.content-with-animation {
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s ease-out, transform 0.5s ease-out;
  transform: translateY(-20px);
}

.content-with-animation.slide-down {
  max-height: 550px;
  transform: translateY(0);
}

.content-with-animation.slide-up {
  max-height: 0;
  transform: translateY(-20px);
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
  width: 20px;
  height: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8); /* Sfondo scuro semi-trasparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Assicurati che sia sopra altri elementi */
}

.modal-content {
  position: relative;
  background: white; /* Sfondo del contenuto */
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 90%;
  max-height: 90%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.modal-image {
  max-width: 100%; /* Adatta la larghezza all'area del modale */
  max-height: 100%; /* Adatta l'altezza all'area del modale */
  border-radius: 4px; /* Angoli arrotondati per l'immagine */
  object-fit: contain; /* Mantieni le proporzioni */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 16px;
  cursor: pointer;
  background: none;
  border: none;
}

.close-icon {
  width: 24px; /* Dimensioni dell'icona di chiusura */
  height: 24px;
}
</style>
