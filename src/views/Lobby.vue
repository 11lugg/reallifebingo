<template>
  <div class="lobby">
    <h2>Lobby - Session: {{ sessionId }}</h2>

    <!-- Leaderboard: Only display players with a selectionCount > 0, sorted descending -->
    <div v-if="leaderboardPlayers.length">
      <h3>Leaderboard</h3>
      <ol class="leaderboard-list">
        <li v-for="(player, index) in leaderboardPlayers" :key="player.id">
          <span @click="viewParticipant(player)">
            {{ index + 1 }} - {{ player.name }}
          </span>
          <!-- Delete icon if host and the player isn't the host -->
          <button
            v-if="isHost && player.id !== currentPlayerId"
            class="delete-btn"
            @click.stop="removePlayer(player)"
            title="Remove Player"
          >
            ✖
          </button>
        </li>
      </ol>
    </div>

    <!-- Waiting players: those without a selectionCount or with a 0 count -->
    <div v-if="remainingPlayers.length">
      <h3>Players Awaiting Selection</h3>
      <ul class="players-list">
        <li v-for="(player, index) in remainingPlayers" :key="player.id">
          <span @click="viewParticipant(player)">
            {{ player.name }}
          </span>
          <!-- Delete icon if host and not deleting themselves -->
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
    </div>

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
    // Leaderboard: players with selectionCount > 0, sorted descending.
    leaderboardPlayers() {
      return this.players
        .filter((p) => p.selectionCount && p.selectionCount > 0)
        .sort((a, b) => b.selectionCount - a.selectionCount);
    },
    // Remaining players: those without selectionCount or with selectionCount of 0.
    remainingPlayers() {
      return this.players.filter(
        (p) => !p.selectionCount || p.selectionCount === 0
      );
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
        // If the session document has been deleted, clear local storage and redirect.
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

/* Leaderboard styling */
.leaderboard-list {
  list-style: none;
  padding: 0;
  margin: 0 auto 1rem;
  max-width: 400px;
  text-align: left;
}

.leaderboard-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fffbea;
  margin: 0.5rem 0;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
}

.leaderboard-list li span {
  text-decoration: none;
  font-weight: bold;
  width: 100%;
  text-align: start;
  cursor: pointer;
}

.score {
  font-weight: 600;
}

/* Players list styling */
.players-list {
  list-style: none;
  padding: 0;
  margin: 1rem auto;
  max-width: 400px;
}

.players-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  margin: 0.5rem 0;
  padding: 0.75rem;
  border-radius: 8px;
}

.players-list li span {
  text-decoration: none;
  font-weight: bold;
  width: 100%;
  text-align: start;
  cursor: pointer;
}

/* Delete button styling */
.delete-btn {
  background: transparent;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
}

/* Enter game button styling */
.enter-btn {
  width: 100%;
  height: 70px;
  border: 1px solid black;
  font-size: larger;
}

/* General button styling */
button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
