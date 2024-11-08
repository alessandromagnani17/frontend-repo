import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./views/HomePage.vue";
import UserLogin from "./components/UserLogin.vue";
import UserRegister from "./components/UserRegister.vue";
import WelcomePage from "./components/WelcomePage.vue";
import DoctorDashboard from "./components/DoctorDashboard.vue";
import PatientDashboard from "./components/PatientDashboard.vue";
import DashboardPage from "./components/DashboardPage.vue";
import VerifyEmail from "./components/VerifyEmail.vue";
import PredictRadiograph from "./components/PredictRadiograph.vue";
import RadiographyDetail from "./components/RadiographyDetail.vue";
import ProfilePage from "./views/ProfilePage.vue";
import SettingsPage from "./views/SettingsPage.vue";
import ViewRadiographs from "./views/ViewRadiographs.vue";
import ManagePatients from "./views/ManagePatients.vue";

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
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "DashboardPage",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "ProfilePage",
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "SettingsPage",
    component: SettingsPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/view-radiographs",
    name: "ViewRadiographs",
    component: ViewRadiographs,
    meta: { requiresAuth: true },
  },
  {
    path: "/manage-patients",
    name: "ManagePatients",
    component: ManagePatients,
    meta: { requiresAuth: true },
  },
  {
    path: "/doctor-dashboard",
    name: "DoctorDashboard",
    component: DoctorDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/patient-dashboard",
    name: "PatientDashboard",
    component: PatientDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/verify-email/:uid",
    name: "VerifyEmail",
    component: VerifyEmail,
  },
  {
    path: "/predict",
    name: "PredictRadiograph",
    component: PredictRadiograph,
    meta: { requiresAuth: true },
  },
  {
    path: "/radiography-detail",
    name: "RadiographyDetail",
    component: RadiographyDetail,
    meta: { requiresAuth: true },
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
