<template>
  <div class="landing">
    <button @click="goToCreate">Create Game</button>
    <button @click="goToJoin">Join Game</button>
  </div>
</template>

<script>
export default {
  name: "Landing",
  created() {
    // Retrieve sessionId and playerId from localStorage
    const sessionId = localStorage.getItem("sessionId");
    const playerId = localStorage.getItem("playerId");
    // If both exist, automatically redirect to the lobby
    if (sessionId && playerId) {
      this.$router.push(`/lobby/${sessionId.toUpperCase()}`);
    }
  },
  methods: {
    goToCreate() {
      this.$router.push("/create");
    },
    goToJoin() {
      this.$router.push("/join");
    },
  },
};
</script>

<style scoped>
.landing {
  flex: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

/* Modern button styling */
button {
  height: 100px;
  width: 250px;
  background: #f8f8f8;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

button:focus {
  outline: none;
}
</style>
