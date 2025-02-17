<template>
  <div class="join-game">
    <h2>Join Game</h2>
    <input type="text" v-model="sessionId" placeholder="Session Code" />
    <input type="text" v-model="playerName" placeholder="Your Name" />
    <button @click="joinGame">Join Game</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default {
  name: "JoinGame",
  data() {
    return {
      sessionId: "",
      playerName: "",
      errorMessage: "",
    };
  },
  methods: {
    async joinGame() {
      if (!this.sessionId || !this.playerName) return;

      const sessionRef = doc(db, "sessions", this.sessionId.toUpperCase());
      const sessionSnap = await getDoc(sessionRef);

      if (sessionSnap.exists()) {
        await updateDoc(sessionRef, {
          players: arrayUnion({ name: this.playerName, id: Date.now() }),
        });
        this.$router.push(`/lobby/${this.sessionId.toUpperCase()}`);
      } else {
        this.errorMessage =
          "Session not found. Please check the code and try again.";
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
