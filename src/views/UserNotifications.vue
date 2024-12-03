<template>
  <div class="container mt-4">
    <h2>Notifiche</h2>
    <div v-if="notifications.length">
      <ul class="list-group">
        <li
          v-for="(notification, index) in notifications"
          :key="index"
          class="list-group-item"
        >
          {{ notification.message }}
          <span class="badge badge-success float-right">{{
            notification.date
          }}</span>
        </li>
      </ul>
    </div>
    <div v-else>
      <p>Non ci sono notifiche.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserNotifications",
  data() {
    return {
      notifications: [],
    };
  },

  mounted() {
    this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      try {
        const userData = JSON.parse(localStorage.getItem("userData")); // Decodifica il JSON
        const userId = userData.userId;

        console.log("Fetching notifications...");
        console.log("Selected patient ID:", userId);

        // Recupera le notifiche dal backend
        const response = await fetch(`/api/notifications?patientId=${userId}`);
        if (!response.ok) {
          throw new Error("Errore nel recupero delle notifiche");
        }

        const data = await response.json();
        console.log("Notifications data:", data); // Stampa il risultato delle notifiche
        this.notifications = data.notifications; // Supponiamo che il backend ritorni un array di notifiche
      } catch (error) {
        console.error("Errore nel recupero delle notifiche:", error);
      }
    },
  },
};
</script>

<style scoped>
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.float-right {
  margin-left: 10px;
}
</style>
