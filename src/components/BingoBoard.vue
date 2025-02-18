<template>
  <div class="bingo-board">
    <!-- Wrap the grid rows in a container that is horizontally scrollable -->
    <div class="board-container">
      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="bingo-row">
        <textarea
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          v-model="board[rowIndex][colIndex]"
          placeholder="Enter option"
          class="bingo-cell"
        />
      </div>
    </div>
    <div class="buttons">
      <button @click="generateBoard">Reset Board</button>
      <button @click="saveBoard">Save Board</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
});

const router = useRouter();

const board = reactive([]);

// Generate a 5×5 board (2D array) of empty strings
function generateBoard() {
  board.length = 0;
  for (let i = 0; i < 5; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      row.push("");
    }
    board.push(row);
  }
}

onMounted(() => {
  generateBoard();
});

async function saveBoard() {
  if (!props.sessionId) {
    console.error("No session ID available");
    return;
  }
  try {
    // Firestore does not support nested arrays, so flatten the board
    const flatBoard = board.flat();
    await updateDoc(doc(db, "sessions", props.sessionId), {
      board: flatBoard,
    });
    alert("Board saved!");
    // Automatically navigate back to the lobby after saving
    router.push(`/lobby/${props.sessionId}`);
  } catch (error) {
    console.error("Error saving board:", error);
  }
}
</script>

<style scoped>
.bingo-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}

.board-container {
  overflow-x: auto;
  width: 100%;
}

.bingo-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
  width: 100%;
  max-width: 500px;
}

.bingo-cell {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  font-size: 1rem;
  text-align: center;
  border: 1px solid #ccc;
  box-sizing: border-box;
  resize: none;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.buttons {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.5rem 1rem;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .bingo-row {
    max-width: 90vw;
  }
  .bingo-cell {
    font-size: 0.9rem;
  }
}
</style>
