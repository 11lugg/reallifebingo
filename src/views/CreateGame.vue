<template>
  <div class="create-game">
    <h2>Create Game</h2>
    <div v-if="!sessionId">
      <button @click="createSession">Create New Session</button>
    </div>
    <div v-else>
      <p>Session ID: {{ sessionId }}</p>
      <p>Your Host ID: {{ hostId }}</p>
      <!-- Render the BingoBoard component for board customization -->
      <BingoBoard :sessionId="sessionId" />
      <button @click="goToLobby">Proceed to Lobby</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import BingoBoard from "../components/BingoBoard.vue";

const router = useRouter();
const sessionId = ref("");
const hostId = ref("");

// Helper function to generate a random 6-character session ID
function generateId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

async function createSession() {
  sessionId.value = generateId(); // generate a session ID
  hostId.value = "Host"; // set host ID explicitly to "Host"
  try {
    // Save hostId in localStorage so it can be used in other views (e.g., Game.vue)
    localStorage.setItem("playerId", hostId.value);
    // Store an isHost flag
    localStorage.setItem("isHost", "true");

    // Create a session document with hostId as the host, and add the host to the players array
    await setDoc(doc(db, "sessions", sessionId.value), {
      host: hostId.value,
      players: [{ name: "Host", id: hostId.value }],
      drawnNumbers: [],
      createdAt: serverTimestamp(),
      board: null, // Board will be customized and saved later
    });
    console.log(
      "Session created with ID:",
      sessionId.value,
      "and host ID:",
      hostId.value
    );
  } catch (error) {
    console.error("Error creating session:", error);
  }
}

function goToLobby() {
  router.push(`/lobby/${sessionId.value}`);
}
</script>

<style scoped>
.create-game {
  text-align: center;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
}
</style>
