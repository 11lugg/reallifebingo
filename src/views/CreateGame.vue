<template>
  <div class="create-game">
    <div v-if="!sessionId">
      <p>Creating session...</p>
    </div>
    <div v-else>
      <p>Session ID: {{ sessionId }}</p>
      <p>Your Host ID: {{ hostId }}</p>
      <!-- Render the BingoBoard component for board customization -->
      <BingoBoard :sessionId="sessionId" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
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
    // Save hostId and sessionId in localStorage
    localStorage.setItem("playerId", hostId.value);
    localStorage.setItem("isHost", "true");
    localStorage.setItem("sessionId", sessionId.value);

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

// Automatically create a session when the component mounts
onMounted(() => {
  if (!sessionId.value) {
    createSession();
  }
});
</script>

<style scoped>
.create-game {
  text-align: center;
  padding: 1rem;
}
</style>
