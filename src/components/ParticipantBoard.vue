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
  white-space: pre-wrap; /* Preserve whitespace and wrap text */
}
.board-cell.selected {
  background-color: #add8e6; /* Light blue highlight */
}
</style>
