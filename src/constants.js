export const PROJECT_ID =
  import.meta.env.VITE_FIREBASE_PROJECT_ID || "real-life-bingo";

export const PROJECT_NAME =
  PROJECT_ID === "lib-dem-bingo" ? "Canvassing Bingo" : "Real Life Bingo";
