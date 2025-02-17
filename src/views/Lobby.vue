<template>
  <div class="lobby">
    <h2>Lobby - Session: {{ sessionId }}</h2>
    <h3>Players:</h3>
    <ul>
      <li v-for="(player, index) in players" :key="index">
        <!-- Clicking on a player's name navigates to their selection view -->
        <a href="#" @click.prevent="viewParticipant(player)">{{
          player.name
        }}</a>
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
      // We assume that each player object has a unique 'id' field.
      // (Ensure that when players join, you save a unique id for them.)
      this.$router.push(`/lobby/${this.sessionId}/participant/${player.id}`);
    },
  },
};
</script>

<style scoped>
.lobby {
  text-align: center;
}
li a {
  cursor: pointer;
  text-decoration: underline;
  color: blue;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
}
</style>
