<template>
  <div id="app">
    <header>
      <h1>Lib Dem Canvassing Bingo</h1>
      <!-- Navigation links (optional) -->
      <nav>
        <template v-if="isLoggedIn">
          <!-- Navigation for logged-in users -->
          <!-- Optionally show a link to the current session if sessionId exists -->
          <router-link v-if="sessionId" :to="`/lobby/${sessionId}`">
            Lobby
          </router-link>
          <router-link v-if="sessionId" :to="`/game/${sessionId}`">
            Game
          </router-link>
        </template>
        <template v-else>
          <!-- Navigation for users not logged in -->
          <router-link to="/">Home</router-link>
          <router-link to="/create">Create Game</router-link>
          <router-link to="/join">Join Game</router-link>
        </template>
      </nav>
    </header>
    <main>
      <!-- This is where your routed views will be rendered -->
      <router-view />
    </main>
    <footer>
      <p>&copy; 2025 Lib Dem Canvassing Bingo</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const playerId = ref(localStorage.getItem("playerId") || "");
const sessionId = ref(localStorage.getItem("sessionId") || "");

onMounted(() => {
  // Initialize on mount
  playerId.value = localStorage.getItem("playerId") || "";
  sessionId.value = localStorage.getItem("sessionId") || "";
});

// Watch for route changes and update the reactive variables
watch(
  () => route.fullPath,
  () => {
    playerId.value = localStorage.getItem("playerId") || "";
    sessionId.value = localStorage.getItem("sessionId") || "";
  }
);

const isLoggedIn = computed(() => {
  return playerId.value.trim() !== "";
});
</script>

<style>
/* Basic layout styling */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  text-align: center;
  background-color: #f8f8f8;
  padding: 1rem;
}

nav {
  display: flex;
  justify-content: center;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
}

main {
  flex: 1;
  display: flex;
  padding: 1rem, 2rem;
  justify-content: center;
}

footer {
  text-align: center;
  padding: 1rem;
  background-color: #f8f8f8;
}
</style>
