<template>
  <div id="app">
    <header>
      <img src="./assets/image.png" />
      <h1>Canvassing Bingo</h1>
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
          <button class="button" v-if="isHost && sessionId" @click="endGame">
            End Game
          </button>
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
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const router = useRouter();
const route = useRoute();

const playerId = ref(localStorage.getItem("playerId") || "");
const sessionId = ref(localStorage.getItem("sessionId") || "");

// isHost is true if localStorage indicates this user is the host.
const isHost = computed(() => localStorage.getItem("isHost") === "true");

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

// Function to log out the user.
function logout() {
  localStorage.removeItem("playerId");
  localStorage.removeItem("sessionId");
  localStorage.removeItem("isHost");
  playerId.value = "";
  sessionId.value = "";
  router.push("/");
}

// Function to end the game.
// This deletes the session document from Firestore.
async function endGame() {
  if (!sessionId.value) return;
  if (
    !confirm(
      "Are you sure you want to end the game? This will delete the session."
    )
  )
    return;
  try {
    await deleteDoc(doc(db, "sessions", sessionId.value));
    console.log("Game ended.");
    // After deleting the session, log out to clear localStorage and redirect.
    logout();
  } catch (error) {
    console.error("Error ending game:", error);
  }
}
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

.button {
  color: red;
  outline: none;
  background: none;
  cursor: pointer;
  border: none;
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
