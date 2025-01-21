import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";

// Importa solo gli stili CSS che ti servono
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);

// Usa il router
app.use(router);

app.mount("#app");
