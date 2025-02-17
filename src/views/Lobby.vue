<template>
  <div class="lobby">
    <h2>Lobby - Session: {{ sessionId }}</h2>
    <h3>Players:</h3>
    <ul>
      <li v-for="(player, index) in players" :key="index">{{ player.name }}</li>
    </ul>
    <!-- Optionally, only the host sees the "Start Game" button -->
    <button @click="startGame">Start Game</button>
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
  created() {
    const sessionRef = doc(db, "sessions", this.sessionId);
    this.unsubscribe = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.players = data.players || [];
      }
    });
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    startGame() {
      // Optionally update a flag in Firestore to mark the game as started
      this.$router.push(`/game/${this.sessionId}`);
    },
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
