// In a separate file (e.g., src/utils/persistentId.js) or at the top of your App.vue:
export function getPersistentPlayerId() {
  let persistentId = localStorage.getItem("persistentPlayerId");
  if (!persistentId) {
    // Generate a random ID, e.g., a 8-character alphanumeric string.
    persistentId = Math.random().toString(36).substr(2, 8).toUpperCase();
    localStorage.setItem("persistentPlayerId", persistentId);
  }
  return persistentId;
}
