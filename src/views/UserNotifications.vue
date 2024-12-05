<template>
  <div class="container mt-4">
    <h2>
      Notifiche
      <span v-if="unreadCount > 0" class="badge badge-warning">{{
        unreadCount
      }}</span>
    </h2>
    <div v-if="notifications.length">
      <ul class="list-group">
        <li
          v-for="(notification, index) in notifications"
          :key="index"
          class="list-group-item"
        >
          {{ notification.message }} - ID: {{ notification.id }}
          <!-- Utilizza notification.id -->
          <span class="badge badge-success float-right">{{
            notification.date
          }}</span>
          <button
            v-if="!notification.isRead"
            @click="markAsRead(notification.id)"
            class="btn btn-sm btn-primary"
          >
            Segna come letta
          </button>
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
      notifications: [], // Lista delle notifiche
      unreadCount: 0, // Conteggio delle notifiche non lette
    };
  },

  mounted() {
    this.fetchNotifications();
  },

  methods: {
    async fetchNotifications() {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData.userId;

        console.log("Fetching notifications...");
        console.log("Selected patient ID:", userId);

        const response = await fetch(`/api/notifications?patientId=${userId}`);
        if (!response.ok) {
          throw new Error("Errore nel recupero delle notifiche");
        }

        const data = await response.json();
        console.log("Notifications raw data:", data);

        // Se la risposta contiene un array direttamente
        if (Array.isArray(data.notifications)) {
          this.notifications = data.notifications;
        } else {
          throw new Error("Formato delle notifiche inatteso");
        }

        console.log("Parsed notifications:", this.notifications);

        // Calcola il conteggio delle notifiche non lette
        this.updateUnreadCount();
      } catch (error) {
        console.error("Errore nel recupero delle notifiche:", error);
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(
        (notification) => !notification.isRead
      ).length;
    },

    async markAsRead(notificationId) {
      console.log("markAsRead called with notificationId:", notificationId);

      if (!notificationId) {
        console.error("No notification ID provided");
        return;
      }

      try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isRead: true }), // Utilizza 'isRead' se è quello che usi nel backend
        });

        if (!response.ok) {
          throw new Error("Errore nel segnare la notifica come letta.");
        }

        // Aggiorna lo stato dopo aver segnato come letta
        this.notifications = this.notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );

        console.log("Notification marked as read:", notificationId);
        this.updateUnreadCount();
      } catch (error) {
        console.error("Errore nel segnare la notifica come letta.", error);
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

.unread-notification {
  font-weight: bold;
  background-color: #f8f9fa;
}

.badge-warning {
  background-color: #ffc107;
  color: #fff;
}
</style>
