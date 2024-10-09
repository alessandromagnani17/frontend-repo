// src/store.js
import { createStore } from "vuex";

const store = createStore({
  state: {
    user: {
      id: null, // Puoi inizializzarlo come necessario
    },
    // Aggiungi qui altri stati se necessario
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    // Aggiungi qui altre mutazioni se necessario
  },
  actions: {
    // Aggiungi qui eventuali azioni se necessario
  },
  getters: {
    // Aggiungi qui eventuali getter se necessario
  },
});

export default store;
