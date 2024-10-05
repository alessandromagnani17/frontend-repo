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
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
