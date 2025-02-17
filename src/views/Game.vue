<template>
  <div class="game">
    <h2>Game In Progress - Session: {{ sessionId }}</h2>

    <!-- Display the board if it exists -->
    <div v-if="board && board.length">
      <h3>Game Board</h3>
      <DisplayBoard :board="board" />
    </div>
    <div v-else>
      <p>The host hasn't set up the board yet.</p>
    </div>

    <!-- You can add additional game UI controls here (e.g., drawing numbers, calling bingo) -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import DisplayBoard from "../components/DisplayBoard.vue";

const route = useRoute();
const sessionId = route.params.sessionId;
const board = ref([]);

onMounted(() => {
  const sessionRef = doc(db, "sessions", sessionId);
  const unsubscribe = onSnapshot(sessionRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      board.value = data.board || [];
    }
  });
});
</script>

<style scoped>
.game {
  text-align: center;
}
</style>
