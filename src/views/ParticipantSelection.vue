<template>
  <div class="participant-selection">
    <h2>Participant Selections - Player: {{ playerId }}</h2>
    <div v-if="hostBoard.length && selection.length">
      <ParticipantBoard :board="hostBoard" :selection="selection" />
    </div>
    <div v-else>
      <p>This participant has found a match yet...</p>
    </div>
    <button class="lobby-btn" @click="goBack">Back to Lobby</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import ParticipantBoard from "../components/ParticipantBoard.vue";

const route = useRoute();
const router = useRouter();
const sessionId = route.params.sessionId;
const playerId = route.params.playerId;

const hostBoard = ref([]);
const selection = ref([]);

// Fetch host board and participant selection data from Firestore.
async function fetchData() {
  // Get the host board from the session document.
  const sessionRef = doc(db, "sessions", sessionId);
  const sessionSnap = await getDoc(sessionRef);
  if (sessionSnap.exists()) {
    const data = sessionSnap.data();
    hostBoard.value = data.board || [];
  }

  // Get the participant's selection from the subcollection.
  const selectionRef = doc(db, "sessions", sessionId, "selections", playerId);
  const selectionSnap = await getDoc(selectionRef);
  if (selectionSnap.exists()) {
    const selData = selectionSnap.data();
    selection.value = selData.selection || [];
  }
}

onMounted(() => {
  fetchData();
});

function goBack() {
  router.push(`/lobby/${sessionId}`);
}
</script>

<style scoped>
.participant-selection {
  text-align: center;
  margin: 1rem;
}

.lobby-btn {
  width: 100%;
  height: 70px;
  font-size: larger;
}

button {
  padding: 0.5rem 1rem;
}
</style>
