<template>
  <div class="game">
    <h2>Game In Progress - Session: {{ sessionStore.sessionId }}</h2>
    <!-- Interactive board for all players -->
    <div>
      <h3>Select Your Options</h3>
      <PlayerBoard
        :hostBoard="sessionStore.board"
        :playerId="sessionStore.playerId"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useSessionStore } from "../stores/sessionStore";
import PlayerBoard from "../components/PlayerBoard.vue";

const router = useRouter();
const sessionStore = useSessionStore();

// Assume sessionStore is already loaded; if not, load from localStorage.
let unsubscribe = null;

onMounted(() => {
  if (sessionStore.sessionId) {
    const sessionRef = doc(db, "sessions", sessionStore.sessionId);
    unsubscribe = onSnapshot(sessionRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        sessionStore.board = data.board || [];
      } else {
        sessionStore.clearSession();
        router.push("/");
      }
    });
  }
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
.game {
  text-align: center;
}
</style>
