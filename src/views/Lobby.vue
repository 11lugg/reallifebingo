<template>
  <div class="lobby">
    <h2>Lobby - Session: {{ sessionId }}</h2>
    <h3>Players:</h3>
    <ul>
      <li
        v-for="(player, index) in players"
        :key="index"
        @click="viewParticipant(player)"
      >
        {{ player.name }}
      </li>
    </ul>
    <div>
      <button @click="enterGame">Enter Game</button>
    </div>
  </div>
</template>

<script>
import { db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

export default {
  name: "Lobby",
  props: ["sessionId"],
  data() {
    return {
      players: [],
    };
  },
  created() {
    const sessionRef = doc(db, "sessions", this.sessionId);
    this.unsubscribe = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.players = data.players || [];
      } else {
        // If the session document has been deleted, clear local storage and redirect
        localStorage.removeItem("playerId");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("isHost");
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
        // We assume that each player object has a unique 'id' field.
        this.$router.push(`/lobby/${this.sessionId}/participant/${player.id}`);
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
  background-color: #f5f5f5;
  margin: 0.5rem 0;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

li:hover {
  transform: translateY(-3px);
}

li {
  text-decoration: none;
  font-weight: bold;
}

/* Style the enter game button */
button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
