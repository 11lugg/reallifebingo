<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>Sorry, we couldn’t find the page you were looking for.</p>
    <button @click="goHome">Go Home</button>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
