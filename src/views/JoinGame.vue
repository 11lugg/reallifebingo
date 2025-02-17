<template>
  <div class="join-game">
    <h2>Join Game</h2>
    <form @submit.prevent="joinGame" class="join-form">
      <input type="text" v-model="sessionId" placeholder="Session Code" />
      <input type="text" v-model="playerName" placeholder="Your Name" />
      <button type="submit">Join Game</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
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
        // Use the joiner's entered display name as the basis
        const chosenName = this.playerName.trim();
        // Get current players from the session
        const playersArray = sessionSnap.data().players || [];
        const existingIds = playersArray.map((player) => player.id);

        // Start with the chosen name as the playerId
        let finalId = chosenName;
        let counter = 1;
        // Append a number until we find a unique id
        while (existingIds.includes(finalId)) {
          finalId = chosenName + counter;
          counter++;
        }

        // Save this joiner's unique id in localStorage
        localStorage.setItem("playerId", finalId);
        // Mark the user as a joiner
        localStorage.setItem("isHost", "false");
        localStorage.setItem("sessionId", this.sessionId);

        await updateDoc(sessionRef, {
          players: arrayUnion({ name: this.playerName, id: finalId }),
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
.join-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.join-game h2 {
  margin-top: 0;
}

.join-form {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.join-form input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.2s ease;
}

.join-form input:focus {
  border-color: #2575fc;
}

.join-form button {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.join-form button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}
</style>
