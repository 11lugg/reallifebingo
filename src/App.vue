<template>
  <div id="app">
    <header>
      <img src="./assets/image.png" alt="Logo" />
      <h1>Canvassing Bingo</h1>
      <nav>
        <template v-if="isLoggedIn">
          <!-- For logged-in users, show links to Lobby and Game if session exists -->
          <router-link v-if="sessionId" :to="`/lobby/${sessionId}`"
            >Lobby</router-link
          >
          <router-link v-if="sessionId" :to="`/game/${sessionId}`"
            >Game</router-link
          >
          <!-- Show End Game button only for host when a session is active -->
          <button v-if="isHost && sessionId" class="button" @click="endGame">
            End Game
          </button>
          <!-- Logout button -->
          <button v-if="sessionId" class="button" @click="logout">
            Logout
          </button>
        </template>
        <template v-else>
          <!-- For users not logged in -->
          <router-link to="/">Home</router-link>
          <router-link to="/create">Create Game</router-link>
          <router-link to="/join">Join Game</router-link>
        </template>
      </nav>
    </header>
    <main>
      <!-- Routed views will be rendered here -->
      <router-view />
    </main>
    <footer>
      <p>&copy; 2025 Lib Dem Canvassing Bingo</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { useSessionStore } from "./stores/sessionStore";

const router = useRouter();
const route = useRoute();
const sessionStore = useSessionStore();

// Load initial session data from localStorage via the store
onMounted(() => {
  sessionStore.loadFromLocalStorage();
});

// Watch for route changes to update the session data if needed
watch(
  () => route.fullPath,
  () => {
    sessionStore.loadFromLocalStorage();
  }
);

// Listen for changes to localStorage in other tabs

function onStorageChange(event) {
  if (
    event.key === "sessionId" ||
    event.key === "playerId" ||
    event.key === "isHost"
  ) {
    sessionStore.loadFromLocalStorage();
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", onStorageChange);
}

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("storage", onStorageChange);
  }
});

// Computed properties for convenience.
const isLoggedIn = computed(() => sessionStore.isLoggedIn);
const sessionId = computed(() => sessionStore.sessionId);
const isHost = computed(() => sessionStore.isHost);

// Logout function: clear session data in the store and navigate to root.
function logout() {
  sessionStore.clearSession();
  router.push("/");
}

// End game function: deletes the session document, then logs out.
async function endGame() {
  if (!sessionStore.sessionId) return;
  if (
    !confirm(
      "Are you sure you want to end the game? This will delete the session."
    )
  )
    return;
  try {
    await deleteDoc(doc(db, "sessions", sessionStore.sessionId));
    console.log("Game ended.");
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
  justify-content: center;
}

footer {
  text-align: center;
  padding: 1rem;
  background-color: #f8f8f8;
}
</style>
