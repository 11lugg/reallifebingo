<template>
  <div class="lobby">
    <h2>Lobby - Session: {{ sessionId }}</h2>
    <h3>Players:</h3>
    <ul>
      <li v-for="(player, index) in players" :key="index">
        <!-- Clicking on a player's name navigates to their selection view -->
        <span @click="viewParticipant(player)">
          {{ player.name }}
        </span>
        <!-- If the current user is host and the player isn't the host, show a delete icon -->
        <button
          v-if="isHost && player.id !== currentPlayerId"
          class="delete-btn"
          @click.stop="removePlayer(player)"
          title="Remove Player"
        >
          ✖
        </button>
      </li>
    </ul>
    <div>
      <button class="enter-btn" @click="enterGame">Enter Game</button>
    </div>
  </div>
</template>

<script>
import { db } from "../firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export default {
  name: "Lobby",
  props: ["sessionId"],
  data() {
    return {
      players: [],
    };
  },
  computed: {
    isHost() {
      // Check if localStorage is available before using it.
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem("isHost") === "true";
      }
      return false;
    },
    currentPlayerId() {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem("playerId") || "";
      }
      return "";
    },
  },
  created() {
    const sessionRef = doc(db, "sessions", this.sessionId);
    this.unsubscribe = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.players = data.players || [];
        // If the current user is not the host and their playerId is no longer in the players array,
        // clear localStorage and redirect to home.
        if (!this.isHost) {
          const currentId = this.currentPlayerId;
          const stillInSession = this.players.some((p) => p.id === currentId);
          if (!stillInSession) {
            localStorage.removeItem("playerId");
            localStorage.removeItem("sessionId");
            localStorage.removeItem("isHost");
            this.$router.push("/");
          }
        }
      } else {
        // If the session document has been deleted, clear local storage and redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("playerId");
          localStorage.removeItem("sessionId");
          localStorage.removeItem("isHost");
        }
        this.$router.push("/");
      }
    });
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    enterGame() {
      this.$router.push(`/game/${this.sessionId}`);
    },
    viewParticipant(player) {
      if (localStorage.getItem("playerId") === player.id) {
        this.$router.push(`/game/${this.sessionId}`);
      } else {
        // Navigate to the participant selection view for that player
        this.$router.push(`/lobby/${this.sessionId}/participant/${player.id}`);
      }
    },
    async removePlayer(player) {
      if (!confirm(`Are you sure you want to remove ${player.name}?`)) return;
      const updatedPlayers = this.players.filter((p) => p.id !== player.id);
      try {
        await updateDoc(doc(db, "sessions", this.sessionId), {
          players: updatedPlayers,
        });
        console.log(`Removed ${player.name}`);
      } catch (error) {
        console.error("Error removing player:", error);
      }
    },
  },
};
</script>

<style scoped>
.lobby {
  text-align: center;
  padding: 1rem;
}

/* Style the players list */
ul {
  list-style: none;
  padding: 0;
  margin: 1rem auto;
  max-width: 400px;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  margin: 0.5rem 0;
  padding: 0.75rem;
  border-radius: 8px;
}

li span {
  text-decoration: none;
  font-weight: bold;
  width: 100%;
  text-align: start;
  cursor: pointer;
}

/* Style the delete icon/button */
.delete-btn {
  background: transparent;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
}

.enter-btn {
  width: 100%;
  height: 70px;
  border: 1px solid black;
  font-size: larger;
}

/* Style the enter game button */
button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
