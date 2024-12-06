<template>
  <div class="notifications-container">
    <h2 class="notifications-header">
      Notifiche
      <span v-if="unreadCount > 0" class="badge badge-warning">
        {{ unreadCount }}
      </span>
    </h2>
    <div v-if="notifications.length">
      <ul class="list-group">
        <li
          v-for="(notification, index) in notifications"
          :key="index"
          class="list-group-item"
          :class="{ 'notification-read': notification.isRead }"
        >
          <!-- Messaggio della notifica -->
          <div class="notification-message">
            <strong>{{ notification.message }}</strong>
          </div>

          <!-- Data e ora -->
          <div class="notification-details">
            <div>
              <span>Data: {{ notification.formattedDate }}</span>
            </div>
            <div>
              <span>Ora: {{ notification.time }}</span>
            </div>
          </div>

          <!-- Pulsante per segnare come letto (ora sopra "Inviata:") -->
          <div class="mark-read-btn-container" v-if="!notification.isRead">
            <button
              @click="markAsRead(notification.id)"
              class="btn btn-sm btn-primary mark-read-btn"
            >
              Segna come letta
            </button>
          </div>

          <!-- Data e ora di invio -->
          <div class="notification-sent-at">
            Inviata: {{ notification.relativeSentAt }}
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="no-notifications">
      <p>Non ci sono notifiche.</p>
    </div>
  </div>
</template>

<script>
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale"; // Importa la localizzazione italiana
import { formatDistanceToNow } from "date-fns";
import EventBus from "../eventBus"; // Importa il tuo EventBus

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

        const response = await fetch(`/api/notifications?patientId=${userId}`);
        if (!response.ok) {
          throw new Error("Errore nel recupero delle notifiche");
        }

        const data = await response.json();
        if (Array.isArray(data.notifications)) {
          // Ordina le notifiche dalla più recente alla più vecchia
          this.notifications = data.notifications
            .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)) // Ordinamento in base a 'sentAt'
            .map((notification) => ({
              ...notification,
              relativeSentAt: formatDistanceToNow(
                new Date(notification.sentAt),
                {
                  addSuffix: true,
                  locale: it, // Aggiunge la lingua italiana
                }
              ),
              // Formattazione della data
              formattedDate: format(
                parseISO(notification.date),
                "d MMMM yyyy",
                {
                  locale: it, // Imposta la lingua italiana per la data
                }
              ),
            }));

          // Calcola il numero di notifiche non lette
          this.unreadCount = this.notifications.filter(
            (notification) => !notification.isRead
          ).length;

          console.log("Numero di notifiche non lette = ", this.unreadCount);
          // Emetti l'evento per aggiornare il conteggio delle notifiche non lette
          EventBus.emit("unread-count-changed", this.unreadCount); // Usa EventBus.emit per emettere l'evento
        } else {
          throw new Error("Formato delle notifiche inatteso");
        }
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
          body: JSON.stringify({ isRead: true }),
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

        this.updateUnreadCount();
      } catch (error) {
        console.error("Errore nel segnare la notifica come letta.", error);
      }
    },
  },
};
</script>

<style scoped>
.notifications-container {
  background: #ffffff;
  max-width: 80%; /* La larghezza massima del container */
  margin: 10% auto 0; /* Centra il container orizzontalmente con auto e imposta un margine in alto */
  padding: 5%;
  border-radius: 15px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  height: auto;
}

.notifications-header {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.list-group-item {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s, opacity 0.3s, color 0.3s;
}

/* Classe per notifiche lette */
.notification-read {
  opacity: 0.5; /* Maggiore opacità per notifiche lette */
}

/* Messaggio della notifica */
.notification-message {
  font-size: 13px; /* Dimensione del testo più piccola */
  font-weight: bold;
  color: #333;
}

.notification-details {
  font-size: 11px; /* Testo più piccolo */
  color: #666;
  margin-top: 5px;
  display: flex;
  flex-direction: column; /* Disposizione verticale */
  gap: 2px; /* Spazio tra le righe */
}

.notification-sent-at {
  font-size: 10px; /* Testo più piccolo */
  color: #999; /* Colore grigio per differenziare */
  text-align: right; /* Allinea a destra */
  margin-top: 5px; /* Spazio sopra */
}

/* Contenitore per il pulsante, allineato a destra sopra "Inviata:" */
.mark-read-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

/* Pulsante per segnare come letto */
.mark-read-btn {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 20px;
  font-size: 11px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.mark-read-btn:hover {
  background: #0056b3;
}

.no-notifications {
  text-align: center;
  color: #777;
  font-size: 13px;
}

.badge-warning {
  background-color: #ffc107;
  color: #fff;
  font-size: 12px; /* Riduce la dimensione del testo nel badge */
  padding: 4px 8px; /* Riduce la dimensione del badge */
  border-radius: 5px; /* Mantiene l'aspetto arrotondato */
  font-weight: bold; /* Mantiene il testo in grassetto */
  margin-left: 5px; /* Distanza dal testo principale */
  position: relative; /* Per poter usare top */
  top: -2px; /* Sposta il badge leggermente più in alto */
}
</style>
