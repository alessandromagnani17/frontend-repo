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
      notifications: [
        { message: "Nuova attività disponibile!", date: "2024-11-28" },
        { message: "Il tuo profilo è stato aggiornato.", date: "2024-11-27" },
        {
          message: "Hai una nuova richiesta di appuntamento.",
          date: "2024-11-26",
        },
      ],
    };
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
