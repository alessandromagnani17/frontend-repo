import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Importa solo gli stili CSS che ti servono
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);

// Usa il router, ma non AmplifyVue
app.use(router).mount("#app");
