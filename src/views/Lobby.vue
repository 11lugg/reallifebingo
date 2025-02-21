<template>
  <div class="lobby">
    <h2>Lobby - Session: {{ sessionStore.sessionId }}</h2>

    <!-- Leaderboard: Only display players with a selectionCount > 0 -->
    <div v-if="leaderboardPlayers.length">
      <h3>Leaderboard</h3>
      <ol class="leaderboard-list">
        <li v-for="(player, index) in leaderboardPlayers" :key="player.id">
          <span @click="viewParticipant(player)">
            {{ index + 1 }} - {{ player.name }}
          </span>
          <strong>({{ player.selectionCount }})</strong>

          <!-- Delete icon if host and the player isn't the host -->
          <button
            v-if="sessionStore.isHost && player.id !== sessionStore.playerId"
            class="delete-btn"
            @click.stop="removePlayer(player)"
            title="Remove Player"
          >
            ✖
          </button>
        </li>
      </ol>
    </div>

    <!-- Waiting Players: Those with no selectionCount or 0 -->
    <div v-if="remainingPlayers.length">
      <h3>Players Awaiting Selection</h3>
      <ul class="players-list">
        <li v-for="player in remainingPlayers" :key="player.id">
          <span @click="viewParticipant(player)">
            {{ player.name }}
          </span>
          <button
            v-if="sessionStore.isHost && player.id !== sessionStore.playerId"
            class="delete-btn"
            @click.stop="removePlayer(player)"
            title="Remove Player"
          >
            ✖
          </button>
        </li>
      </ul>
    </div>

    <div>
      <button class="enter-btn" @click="enterGame">Enter Game</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "../stores/sessionStore";

// Use the Pinia store for centralized session state.
const sessionStore = useSessionStore();
const router = useRouter();

// When the component mounts, start listening to the session.
let unsubscribe = null;
onMounted(() => {
  if (sessionStore.sessionId) {
    unsubscribe = sessionStore.listenToSession();
  }
});

// Clean up the listener when unmounted.
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});

// Computed property for leaderboard: players with selectionCount > 0, sorted descending.
const leaderboardPlayers = computed(() => {
  return sessionStore.players
    .filter((player) => player.selectionCount && player.selectionCount > 0)
    .sort((a, b) => b.selectionCount - a.selectionCount);
});

// Computed property for waiting players: those without selectionCount or with 0.
const remainingPlayers = computed(() => {
  return sessionStore.players.filter(
    (player) => !player.selectionCount || player.selectionCount === 0
  );
});

// Navigate to the game view.
function enterGame() {
  router.push(`/game/${sessionStore.sessionId}`);
}

// Navigate to the participant selection view or game view.
function viewParticipant(player) {
  if (sessionStore.playerId === player.id) {
    router.push(`/game/${sessionStore.sessionId}`);
  } else {
    router.push(`/lobby/${sessionStore.sessionId}/participant/${player.id}`);
  }
}

// Remove a player and update the session document via the store.
async function removePlayer(player) {
  if (!confirm(`Are you sure you want to remove ${player.name}?`)) return;
  const updatedPlayers = sessionStore.players.filter((p) => p.id !== player.id);
  await sessionStore.updatePlayers(updatedPlayers);
}
</script>

<style scoped>
.lobby {
  text-align: center;
  padding: 1rem;
}

/* Leaderboard styling */
.leaderboard-list {
  list-style: none;
  padding: 0;
  margin: 0 auto 1rem;
  max-width: 400px;
  text-align: left;
}

.leaderboard-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fffbea;
  margin: 0.5rem 0;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: bold;
}

.leaderboard-list li span {
  text-decoration: none;
  font-weight: bold;
  width: 100%;
  text-align: start;
  cursor: pointer;
}

.score {
  font-weight: 600;
}

/* Players list styling */
.players-list {
  list-style: none;
  padding: 0;
  margin: 1rem auto;
  max-width: 400px;
}

.players-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f5f5f5;
  margin: 0.5rem 0;
  padding: 0.75rem;
  border-radius: 8px;
}

.players-list li span {
  text-decoration: none;
  font-weight: bold;
  width: 100%;
  text-align: start;
  cursor: pointer;
}

/* Delete button styling */
.delete-btn {
  background: transparent;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;
}

/* Enter game button styling */
.enter-btn {
  width: 100%;
  height: 70px;
  border: 1px solid black;
  font-size: larger;
}

/* General button styling */
button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
