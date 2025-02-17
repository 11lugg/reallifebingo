<template>
  <div class="bingo-board">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="bingo-row">
      <input
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        v-model="board[rowIndex][colIndex]"
        placeholder="Enter option"
        class="bingo-cell"
      />
    </div>
    <div class="buttons">
      <button @click="generateBoard">Reset</button>
      <button @click="saveBoard">Save Board</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const props = defineProps({
  sessionId: {
    type: String,
    required: true,
  },
});

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
  margin: 1rem;
}
.bingo-row {
  display: flex;
}
.bingo-cell {
  width: 100px;
  height: 100px;
  margin: 5px;
  font-size: 16px;
  text-align: center;
  padding: 0.5rem;
}
.buttons {
  margin-top: 1rem;
}
button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
}
</style>
