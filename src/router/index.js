// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Landing from "../views/Landing.vue";
import CreateGame from "../views/CreateGame.vue";
import JoinGame from "../views/JoinGame.vue";
import Lobby from "../views/Lobby.vue";
import Game from "../views/Game.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/create", name: "CreateGame", component: CreateGame },
  { path: "/join", name: "JoinGame", component: JoinGame },
  { path: "/lobby/:sessionId", name: "Lobby", component: Lobby, props: true },
  { path: "/game/:sessionId", name: "Game", component: Game, props: true },
  { path: "/:catchAll(.*)", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
