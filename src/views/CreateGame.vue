<template>
  <div class="create-game">
    <div v-if="!sessionStore.sessionId">
      <p>Creating session...</p>
    </div>
    <div v-else>
      <p>Session ID: {{ sessionStore.sessionId }}</p>
      <p>Your Host ID: {{ sessionStore.playerId }}</p>
      <!-- Render the BingoBoard component for board customization -->
      <BingoBoard :sessionId="sessionStore.sessionId" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useSessionStore } from "../stores/sessionStore";
import { db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import BingoBoard from "../components/BingoBoard.vue";
import { getPersistentPlayerId } from "../utils/persistentId";

const sessionStore = useSessionStore();

function generateId() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

async function createSession() {
  const newSessionId = generateId();
  // For the host, use a persistent id. We'll prefix it with "Host-" so it's clear.
  const persistentHostId = "Host-" + getPersistentPlayerId();

  // Set session data in the store
  sessionStore.setSession({
    sessionId: newSessionId,
    playerId: persistentHostId,
    isHost: true,
  });

  try {
    // Create the session document with the host info and an empty board.
    await setDoc(doc(db, "sessions", newSessionId), {
      host: persistentHostId,
      players: [{ name: "Host", id: persistentHostId }],
      drawnNumbers: [],
      createdAt: serverTimestamp(),
      board: null,
    });
    console.log(
      "Session created with ID:",
      newSessionId,
      "and host ID:",
      persistentHostId
    );
  } catch (error) {
    console.error("Error creating session:", error);
  }
}

onMounted(() => {
  if (!sessionStore.sessionId) {
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
