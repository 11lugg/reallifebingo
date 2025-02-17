<template>
  <div id="app">
    <header>
      <h1>Real Life Bingo</h1>
      <!-- Navigation links (optional) -->
      <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/create">Create Game</router-link>
        <router-link to="/join">Join Game</router-link>
      </nav>
    </header>
    <main>
      <!-- This is where your routed views will be rendered -->
      <router-view />
    </main>
    <footer>
      <p>&copy; 2025 Real Life Bingo</p>
    </footer>
  </div>
</template>

<script setup>
// If you need to import global components or perform setup logic, do it here.
</script>

<style>
/* Basic layout styling */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background-color: #f8f8f8;
  padding: 1rem;
}

nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #333;
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  text-align: center;
  padding: 1rem;
  background-color: #f8f8f8;
}
</style>
