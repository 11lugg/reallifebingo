<template>
  <div class="player-board">
    <div
      v-for="(row, rowIndex) in gridHostBoard"
      :key="rowIndex"
      class="board-row"
    >
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="board-cell"
        :class="{ selected: selection[rowIndex * 5 + colIndex] }"
        @click="toggleSelection(rowIndex * 5 + colIndex)"
      >
        {{ cell }}
      </div>
    </div>
    <button class="save-btn" @click="saveSelection">Save Selection</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Props: hostBoard (flat array of 25 items) and playerId for the current player.
const props = defineProps({
  hostBoard: {
    type: Array,
    required: true,
  },
  playerId: {
    type: String,
    required: true,
  },
});

// Get sessionId from the route and set up the router.
const route = useRoute();
const router = useRouter();
const sessionId = route.params.sessionId;

// Initialize the selection as a flat array of 25 booleans (all false)
const selection = ref(Array(25).fill(false));

// On mount, try to fetch any existing selection for this player.
onMounted(async () => {
  try {
    const selectionRef = doc(
      db,
      "sessions",
      sessionId,
      "selections",
      props.playerId
    );
    const selectionSnap = await getDoc(selectionRef);
    if (selectionSnap.exists()) {
      const data = selectionSnap.data();
      // Ensure data.selection is an array of 25 booleans.
      if (Array.isArray(data.selection) && data.selection.length === 25) {
        selection.value = data.selection;
      }
    }
  } catch (error) {
    console.error("Error fetching selection:", error);
  }
});

// Toggle the selection for a given cell index.
function toggleSelection(index) {
  selection.value[index] = !selection.value[index];
}

// Save the updated selection back to Firestore, then navigate back to the lobby.
async function saveSelection() {
  try {
    await setDoc(doc(db, "sessions", sessionId, "selections", props.playerId), {
      selection: selection.value,
    });
    alert("Selection saved!");
    router.push(`/lobby/${sessionId}`);
  } catch (error) {
    console.error("Error saving selection:", error);
  }
}

// Convert the flat hostBoard array into a 5x5 grid for display.
const gridHostBoard = computed(() => {
  if (props.hostBoard.length === 25) {
    let grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(props.hostBoard.slice(i * 5, i * 5 + 5));
    }
    return grid;
  }
  return [];
});
</script>

<style scoped>
.player-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
}

.board-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  width: 100%;
  max-width: 500px;
}

.board-cell {
  width: 100%;
  /* Remove fixed height and use min-height for flexibility */
  min-height: 100px;
  padding: 0.5rem;
  font-size: 1rem;
  text-align: center;
  border: 1px solid #ccc;
  box-sizing: border-box;
  resize: none; /* Prevent user from manually resizing */
  overflow-wrap: break-word; /* Allow text to wrap */
  white-space: pre-wrap;
}

.board-cell.selected {
  background-color: #90ee90; /* Light green highlight for selected cells */
}

.save-btn {
  width: 100%;
  height: 70px;
  font-size: larger;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
}
</style>
