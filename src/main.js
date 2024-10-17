import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // Importa il tuo store Vuex

// Importa solo gli stili CSS che ti servono
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);

// Usa il router e lo store Vuex
app.use(router);
app.use(store); // Aggiungi questa linea per utilizzare Vuex

app.mount("#app");
