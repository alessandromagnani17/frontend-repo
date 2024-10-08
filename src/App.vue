<template>
  <div id="app" @click="closeNavbarOnClick">
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top"
    >
      <div class="container">
        <a class="navbar-brand" href="#" @click.prevent="handleLogoClick"
          >Radiology Portal</a
        >
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
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" @click="closeNavbar"
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register" @click="closeNavbar"
                >Registrati</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/login" @click="closeNavbar"
                >Login</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboard" @click="closeNavbar"
                >Dashboard</router-link
              >
            </li>
            <li class="nav-item dropdown" @click="toggleDropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="dropdownOpen"
              >
                <i class="fas fa-user"></i>
              </a>
              <div
                class="dropdown-menu"
                :class="{ show: dropdownOpen }"
                style="position: absolute; top: 100%; left: 0"
              >
                <router-link
                  class="dropdown-item"
                  to="/profile"
                  @click="closeNavbar"
                  >Profilo</router-link
                >
                <router-link
                  class="dropdown-item"
                  to="/settings"
                  @click="closeNavbar"
                  >Impostazioni</router-link
                >
                <a class="dropdown-item" href="#" @click.prevent="logout"
                  >Logout</a
                >
              </div>
            </li>
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
export default {
  name: "App",
  data() {
    return {
      dropdownOpen: false,
      navbarOpen: false,
    };
  },
  methods: {
    toggleNavbar() {
      this.navbarOpen = !this.navbarOpen;
    },
    closeNavbar() {
      this.navbarOpen = false;
    },
    closeNavbarOnClick(event) {
      // Verifica se il clic è avvenuto all'esterno della navbar
      const isNavbar = event.target.closest(".navbar");
      if (!isNavbar) {
        this.closeNavbar();
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    logout() {
      // Clear the token from localStorage
      localStorage.removeItem("authToken");
      alert("Logout successful!");
      this.$router.push("/"); // Redirect to homepage after logout
    },
    handleLogoClick() {
      const authToken = localStorage.getItem("authToken");

      if (authToken) {
        // Redirect to the welcome page if logged in
        this.$router.push({ name: "WelcomePage" });
      } else {
        // Redirect to the homepage if not logged in
        this.$router.push("/");
      }
    },
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

.nav-link {
  font-size: 1.2rem; /* Stile uniformato */
  color: #ffffff;
}

.nav-link:hover {
  color: #d4d4d4;
}

.navbar-toggler {
  border-color: #ffffff;
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

.navbar .nav-link i.fas.fa-user {
  font-size: 1.5rem;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    text-align: center;
  }
}

@media (max-width: 767.98px) {
  .navbar-brand {
    font-size: 1.5rem;
  }

  .sidebar {
    display: none;
  }
}
</style>
