<template>
  <div id="app">
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
          @click="toggleNavbar"
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
        <aside class="col-md-3 sidebar bg-dark text-white">
          <h4 class="text-center mt-3">Link Rapidi</h4>
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/view-radiographs"
                >Visualizza Radiografie</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/manage-patients"
                >Gestisci Pazienti</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-white" to="/reports"
                >Rapporti</router-link
              >
            </li>
          </ul>
        </aside>
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
        this.$router.push("/WelcomePage");
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

.navbar {
  background-color: #007bff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
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
  padding: 0 15px;
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 20px;
  background: linear-gradient(180deg, #212529, #343a40);
}

.sidebar .nav-link {
  color: #cfd2d6;
}

.sidebar .nav-link:hover {
  background-color: #495057;
  border-radius: 5px;
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
