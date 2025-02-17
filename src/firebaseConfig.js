// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCREP5NLzhyPr82gcc0KfgmwmVx4i1fKgw",
  authDomain: "real-life-bingo.firebaseapp.com",
  projectId: "real-life-bingo",
  storageBucket: "real-life-bingo.firebasestorage.app",
  messagingSenderId: "338531154542",
  appId: "1:338531154542:web:64f16e3091fc030dd3047f",
  measurementId: "G-P1DNVC068Q",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
