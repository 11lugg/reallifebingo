<template>
  <div class="display-board">
    <!-- Render each row of the gridBoard -->
    <div v-for="(row, rowIndex) in gridBoard" :key="rowIndex" class="board-row">
      <!-- Render each cell -->
      <div v-for="(cell, colIndex) in row" :key="colIndex" class="board-cell">
        {{ cell }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  board: {
    type: Array,
    required: true,
  },
});

// Convert a flat board array into a 2D array (5x5) if needed.
const gridBoard = computed(() => {
  // If the board has 25 elements, assume it's flat and convert it.
  if (props.board.length === 25) {
    let newBoard = [];
    for (let i = 0; i < 5; i++) {
      newBoard.push(props.board.slice(i * 5, i * 5 + 5));
    }
    return newBoard;
  }
  // Otherwise, assume the board is already in 2D format.
  return props.board;
});
</script>

<style scoped>
.display-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem 0;
}
.board-row {
  display: flex;
}
.board-cell {
  width: 100px;
  height: 100px;
  margin: 5px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  background-color: #fefefe;
}
</style>
