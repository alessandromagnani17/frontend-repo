<template>
  <div id="app" @click="closeNavbarOnClick">
    <nav
      v-bind:key="authToken"
      class="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top"
    >
      <div class="container d-flex justify-content-between">
        <a class="navbar-brand" href="#" @click.prevent="handleLogoClick">
          Radiology Portal
        </a>
        <button
          class="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded="navbarOpen"
          aria-label="Toggle navigation"
          @click.stop="toggleNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          id="navbarNav"
          class="collapse navbar-collapse"
          :class="{ show: navbarOpen }"
        >
          <ul class="navbar-nav me-auto">
            <template v-if="isLoggedIn">
              <li v-if="userRole === 'doctor'" class="nav-item">
                <router-link
                  class="nav-link"
                  to="/predict"
                  @click="closeNavbar"
                >
                  Predici Radiografie
                </router-link>
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  :to="viewRadiographsRoute"
                  @click="closeNavbar"
                  >Visualizza Radiografie</router-link
                >
              </li>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  to="/activity-calendar"
                  @click="closeNavbar"
                >
                  Calendario Attività
                </router-link>
              </li>
            </template>

            <template v-else>
              <li class="nav-item">
                <router-link
                  class="nav-link"
                  to="/register"
                  @click="closeNavbar"
                >
                  Registrati
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/login" @click="closeNavbar">
                  Login
                </router-link>
              </li>
            </template>
          </ul>

          <ul class="navbar-nav">
            <!-- Contenitore per il dropdown -->
            <template v-if="isLoggedIn">
              <li class="nav-item dropdown d-flex align-items-center">
                <span class="nav-link me-2" style="pointer-events: none">{{
                  userDataName
                }}</span>

                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="dropdownOpen"
                  @click="toggleDropdown"
                >
                  <i class="fas fa-user"></i>
                </a>
                <div
                  class="dropdown-menu"
                  :class="{ show: dropdownOpen }"
                  style="position: absolute; top: 100%; right: 0"
                >
                  <router-link
                    class="dropdown-item"
                    to="/notifications"
                    @click="toggleDropdown"
                  >
                    <i class="fas fa-bell"></i> Notifiche
                    <!-- Mostra il badge solo se unreadCount è maggiore di 0 -->
                    <span
                      v-if="unreadCount > 0"
                      class="badge badge-pill badge-warning text-red"
                    >
                      {{ unreadCount }}
                    </span>
                  </router-link>
                  <router-link
                    class="dropdown-item"
                    to="/profile"
                    @click="toggleDropdown"
                    >Profilo</router-link
                  >
                  <a class="dropdown-item" href="#" @click.prevent="logout"
                    >Logout</a
                  >
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <main class="col-md-9">
          <router-view></router-view>
          <!-- Visualizza il componente corretto in base alla rotta -->
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "./eventBus";

export default {
  name: "App",
  data() {
    return {
      dropdownOpen: false,
      navbarOpen: false,
      authToken: null,
      userRole: null,
      userDataUid: null,
      userDataName: null,
      userDataSurname: null,
      unreadCount: 0, // Aggiungi questa variabile per il conteggio delle notifiche non lette
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.authToken;
    },
    viewRadiographsRoute() {
      if (this.userRole === "patient") {
        localStorage.setItem("Name", this.userDataName);
        localStorage.setItem("Surname", this.userDataSurname);
        return { path: "/view-radiographs", query: { uid: this.userDataUid } };
      } else {
        return { path: "/view-radiographs" };
      }
    },
  },
  methods: {
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
    closeNavbar() {
      this.navbarOpen = false; // Chiudi la navbar
      this.dropdownOpen = false; // Chiudi il dropdown
    },

    closeNavbarOnClick(event) {
      const isNavbar = event.target.closest(".navbar"); // Verifica se il clic è dentro la navbar
      const isNavbarToggler = event.target.closest(".navbar-toggler"); // Verifica se il clic è sul bottone di toggling
      const isDropdownMenu = event.target.closest(".dropdown-menu"); // Verifica se il clic è dentro il dropdown menu
      const isDropdownToggle = event.target.closest(".dropdown-toggle"); // Verifica se il clic è sul bottone di toggle del dropdown

      // Se il clic non è dentro la navbar, il toggler o il dropdown menu, chiudi sia la navbar che il dropdown
      if (
        !isNavbar &&
        !isNavbarToggler &&
        !isDropdownMenu &&
        !isDropdownToggle
      ) {
        this.closeNavbar();
      }
    },
    toggleDropdown() {
      console.log(this.dropdownOpen);
      this.dropdownOpen = !this.dropdownOpen;
    },
    logout() {
      console.log("[DEBUG] Executing logout...");
      localStorage.clear();
      this.authToken = null;
      this.userRole = null;
      this.userDataUid = null;
      this.toggleDropdown();
      EventBus.emit("auth-changed");
      this.$router.push("/");
    },
    handleLogoClick() {
      this.goToDashboard();
      this.closeNavbar();
    },
    goToDashboard() {
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (this.isLoggedIn) {
        if (userData.role === "doctor") {
          this.$router.push({ name: "DoctorDashboard" });
        } else if (userData.role === "patient") {
          this.$router.push({ name: "PatientDashboard" });
        }
      } else {
        this.$router.push("/");
      }
    },
    updateAuthStatus() {
      this.authToken = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData"));
      this.userRole = userData?.role || null;
      this.userDataUid = userData?.uid || null;
      this.userDataName = userData?.name || null;
      this.userDataSurname = userData?.family_name || null;
    },
    updateUnreadCount(count) {
      this.unreadCount = count; // Aggiorna il conteggio delle notifiche non lette
      this.dropdownOpen = false;
      //console.log("[DEBUG] updateAuthStatus - authToken:", this.authToken);
      //console.log("[DEBUG] role:", this.userRole);
    },
  },
  mounted() {
    this.updateAuthStatus(); // Inizializza authToken e userRole
    EventBus.on("auth-changed", this.updateAuthStatus);

    // Aggiorna il conteggio delle notifiche non lette dal componente UserNotifications
    EventBus.on("unread-count-changed", this.updateUnreadCount); // Ascolta l'evento per il conteggio delle notifiche
  },
  beforeUnmount() {
    EventBus.off("auth-changed", this.updateAuthStatus);
  },
};
</script>

<style>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex; /* Attiva Flexbox */
  height: auto; /* Rimuovi l'altezza fissa */
  justify-content: center; /* Centra orizzontalmente */
  align-items: center; /* Centra verticalmente */
  height: 100vh; /* Imposta l'altezza della riga al 100% della viewport */
}

main {
  max-width: 900px; /* Imposta una larghezza massima per il contenuto */
  width: 100%; /* Occupa il 100% della larghezza del suo contenitore */
  padding: 20px; /* Aggiunge del padding interno */
  background: #ffffff; /* Sfondo bianco per il main */
}

.navbar {
  background-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  padding-left: 20px;
}

.navbar:hover {
  background-color: #0056b3;
}

.navbar-brand {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
}

.navbar-nav .nav-item {
  margin-left: 15px; /* Regola questo valore per aumentare o diminuire il distanziamento */
}

.nav-link {
  font-size: 1.2rem; /* Stile uniformato */
  color: #ffffff;
}

.nav-link:hover {
  color: #d4d4d4;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' viewBox='0 0 30 30'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.container-fluid {
  max-width: 1200px;
  margin: 0 auto;
  margin-left: 0px;
  padding-left: 0px;
}

.dropdown-menu {
  position: absolute;
  background-color: #343a40;
  border: none;
  z-index: 1000;
}

.dropdown-item {
  color: #cfd2d6;
}

.dropdown-item:hover {
  background-color: #495057;
  color: #ffffff;
}

.badge.text-red {
  color: #db0808ea;
}
</style>
