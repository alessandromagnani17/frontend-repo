import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Importa solo gli stili CSS che ti servono
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);

// Usa il router e lo store Vuex
app.use(router);

app.mount("#app");
