<template>
  <div class="landing">
    <h1>Bingo Game</h1>
    <button @click="goToCreate">Create Game</button>
    <button @click="goToJoin">Join Game</button>
  </div>
</template>

<script>
export default {
  name: "Landing",
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
/* Your styles here */
</style>
