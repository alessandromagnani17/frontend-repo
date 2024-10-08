import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./views/HomePage.vue";
import UserLogin from "./components/UserLogin.vue";
import UserRegister from "./components/UserRegister.vue";
import WelcomePage from "./components/WelcomePage.vue";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/login",
    name: "UserLogin",
    component: UserLogin,
    meta: { requiresGuest: true },
  },
  {
    path: "/register",
    name: "UserRegister",
    component: UserRegister,
    meta: { requiresGuest: true },
  },
  {
    path: "/welcome",
    name: "WelcomePage",
    component: WelcomePage,
    meta: { requiresAuth: true }, // Set meta to mark this route as requiring authentication
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard to protect authenticated routes and redirect guests
router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem("authToken");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if the user is authenticated
    if (!authToken) {
      // If no token, redirect to login
      return next({ name: "UserLogin" });
    }
  }

  if (to.matched.some((record) => record.meta.requiresGuest)) {
    // Prevent logged-in users from accessing login/register routes
    if (authToken) {
      return next({ name: "WelcomePage" }); // Redirect to the welcome page if already logged in
    }
  }

  next(); // Always proceed to the next route if checks pass
});

export default router;
