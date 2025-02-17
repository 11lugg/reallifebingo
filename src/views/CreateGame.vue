<template>
  <div class="create-game">
    <h2>Create Game</h2>
    <!-- If sessionId is not set, show the create button -->
    <div v-if="!sessionId">
      <button @click="createSession">Create New Session</button>
    </div>
    <!-- Once session is created, show the session ID, board, and proceed button -->
    <div v-else>
      <p>Session ID: {{ sessionId }}</p>
      <!-- Render the BingoBoard and pass sessionId as a prop -->
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

// Function to generate a random 6-character session code
function generateSessionId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

async function createSession() {
  sessionId.value = generateSessionId();
  try {
    await setDoc(doc(db, "sessions", sessionId.value), {
      host: "hostUser", // Replace with actual host info if needed
      players: [],
      drawnNumbers: [],
      createdAt: serverTimestamp(),
      board: null, // Board data will be added via the BingoBoard component
    });
    console.log("Session created with ID:", sessionId.value);
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
