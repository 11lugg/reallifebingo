// src/stores/sessionStore.js
import { defineStore } from "pinia";
import { db } from "../firebaseConfig";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

export const useSessionStore = defineStore("session", {
  state: () => ({
    sessionId: localStorage.getItem("sessionId") || "",
    playerId: localStorage.getItem("playerId") || "",
    isHost: localStorage.getItem("isHost") === "true",
    players: [],
    board: [], // Optional: store board here if needed
  }),
  getters: {
    isLoggedIn: (state) => state.playerId.trim() !== "",
    leaderboardPlayers: (state) => {
      return state.players
        .filter((p) => p.selectionCount && p.selectionCount > 0)
        .sort((a, b) => b.selectionCount - a.selectionCount);
    },
    remainingPlayers: (state) => {
      return state.players.filter(
        (p) => !p.selectionCount || p.selectionCount === 0
      );
    },
  },
  actions: {
    // Initialize store state from localStorage
    loadFromLocalStorage() {
      this.sessionId = localStorage.getItem("sessionId") || "";
      this.playerId = localStorage.getItem("playerId") || "";
      this.isHost = localStorage.getItem("isHost") === "true";
    },
    // Save session data to localStorage (call after session changes)
    saveToLocalStorage() {
      localStorage.setItem("sessionId", this.sessionId);
      localStorage.setItem("playerId", this.playerId);
      localStorage.setItem("isHost", this.isHost ? "true" : "false");
    },
    // Set session data when creating or joining a session
    setSession({ sessionId, playerId, isHost }) {
      this.sessionId = sessionId;
      this.playerId = playerId;
      this.isHost = isHost;
      this.saveToLocalStorage();
    },
    // Clear session data
    clearSession() {
      this.sessionId = "";
      this.playerId = "";
      this.isHost = false;
      this.players = [];
      localStorage.removeItem("sessionId");
      localStorage.removeItem("playerId");
      localStorage.removeItem("isHost");
    },
    // Set up a Firestore listener for the session document
    listenToSession() {
      if (!this.sessionId) return;
      const sessionRef = doc(db, "sessions", this.sessionId);
      // Return the unsubscribe function so that the caller can clean up
      return onSnapshot(sessionRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          this.players = data.players || [];
          this.board = data.board || [];
        } else {
          // Session ended; clear store and redirect if necessary
          this.clearSession();
        }
      });
    },
    // Update the players array in Firestore (e.g., when removing a player)
    async updatePlayers(updatedPlayers) {
      if (!this.sessionId) return;
      try {
        await updateDoc(doc(db, "sessions", this.sessionId), {
          players: updatedPlayers,
        });
      } catch (error) {
        console.error("Error updating players:", error);
      }
    },
  },
});
