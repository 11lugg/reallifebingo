<template>
  <div class="participant-board">
    <div v-for="(row, rowIndex) in gridBoard" :key="rowIndex" class="board-row">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="board-cell"
        :class="{ selected: isSelected(rowIndex * 5 + colIndex) }"
      >
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
  selection: {
    type: Array,
    required: true,
  },
});

// Convert flat board array (25 items) into a 5×5 grid.
const gridBoard = computed(() => {
  if (props.board.length === 25) {
    let grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(props.board.slice(i * 5, i * 5 + 5));
    }
    return grid;
  }
  return props.board;
});

function isSelected(index) {
  return props.selection[index];
}
</script>

<style scoped>
.participant-board {
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
.board-cell.selected {
  background-color: #add8e6; /* Light blue highlight */
}
</style>
