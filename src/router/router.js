import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/common/HomePage.vue";
import UserLogin from "@/views/auth/UserLogin.vue";
import UserRegister from "@/views/auth/UserRegister.vue";
import WelcomePage from "@/views/common/WelcomePage.vue";
import DoctorDashboard from "@/views/dashboard/DoctorDashboard.vue";
import PatientDashboard from "@/views/dashboard/PatientDashboard.vue";
import DashboardPage from "@/views/dashboard/DashboardPage.vue";
import VerifyEmail from "@/views/auth/VerifyEmail.vue";
import PredictRadiograph from "@/views/radiograph/PredictRadiograph.vue";
import RadiographDetail from "@/views/radiograph/RadiographDetail.vue";
import ResetPassword from "@/views/auth/ResetPassword.vue";
import ProfilePage from "@/views/common/ProfilePage.vue";
import ViewRadiographs from "@/views/radiograph/ViewRadiographs.vue";
import ActivityCalendar from "@/views/calendar/ActivityCalendar.vue";
import UserNotifications from "@/views/common/UserNotifications.vue";

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
    path: "/notifications",
    name: "UserNotifications",
    component: UserNotifications,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "ProfilePage",
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/view-radiographs",
    name: "ViewRadiographs",
    component: ViewRadiographs,
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
    path: "/reset-password/:uid",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/predict",
    name: "PredictRadiograph",
    component: PredictRadiograph,
    meta: { requiresAuth: true },
  },
  {
    path: "/radiograph-detail",
    name: "RadiographDetail",
    component: RadiographDetail,
    meta: { requiresAuth: true },
  },
  {
    path: "/activity-calendar",
    name: "ActivityCalendar",
    component: ActivityCalendar,
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
