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
import { useSessionStore } from "../stores/sessionStore";
import { getPersistentPlayerId } from "../utils/persistentId";

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
        const chosenName = this.playerName.trim();
        // Determine if the user is logging in as host based on their name (case-insensitive)
        const isHostLogin = chosenName.toLowerCase() === "host";

        // Retrieve a persistent id; this helper function creates one if it doesn't exist.
        const persistentId = getPersistentPlayerId();

        // Construct a base ID; for host, we use "Host-" prefix; for joiners, we use the chosen name.
        const baseId = isHostLogin
          ? `Host-${persistentId}`
          : `${chosenName}-${persistentId}`;

        // Check if a player with the same base ID already exists in the session.
        const playersArray = sessionSnap.data().players || [];
        const existingPlayer = playersArray.find((p) =>
          p.id.startsWith(baseId)
        );
        let finalId;
        if (existingPlayer) {
          // Re-use the existing id.
          finalId = existingPlayer.id;
        } else {
          finalId = baseId;
        }

        // Use the session store to set joiner session data.
        const sessionStore = useSessionStore();
        sessionStore.setSession({
          sessionId: this.sessionId.toUpperCase(),
          playerId: finalId,
          isHost: isHostLogin,
        });

        // Save the session-specific data in localStorage.
        localStorage.setItem("playerId", finalId);
        localStorage.setItem("sessionId", this.sessionId.toUpperCase());
        localStorage.setItem("isHost", isHostLogin ? "true" : "false");

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
