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
  },
  {
    path: "/register",
    name: "UserRegister",
    component: UserRegister,
  },
  {
    path: "/confirm-email/:email",
    name: "EmailConfirmation",
    component: () => import("@/components/EmailConfirmation.vue"),
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

// Route guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem("authToken");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authToken) {
      // Redirect to login if not authenticated
      return next({ name: "UserLogin" });
    }
  }

  next(); // Always call next() to proceed
});

export default router;
