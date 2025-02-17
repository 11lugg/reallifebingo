<template>
  <div class="game">
    <h2>Game In Progress - Session: {{ sessionId }}</h2>

    <!-- Interactive board for all players -->
    <div>
      <h3>Select Your Options</h3>
      <PlayerBoard :hostBoard="hostBoard" :playerId="playerId" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PlayerBoard from "../components/PlayerBoard.vue";

const route = useRoute();
const sessionId = route.params.sessionId;
const hostBoard = ref([]);

// Retrieve playerId from localStorage
const playerId = localStorage.getItem("playerId") || "UnknownPlayer";

// Listen for updates to the host board in the session document.
onMounted(() => {
  const sessionRef = doc(db, "sessions", sessionId);
  onSnapshot(sessionRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      hostBoard.value = data.board || [];
    }
  });
});
</script>

<style scoped>
.game {
  text-align: center;
}
</style>
