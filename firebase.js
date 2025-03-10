import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc, collection, addDoc, query, where, onSnapshot } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzohdVJcFOJZitnA4kruuDuLxmR3Zca1Q",
  authDomain: "greenbytes-74d08.firebaseapp.com",
  projectId: "greenbytes-74d08",
  storageBucket: "greenbytes-74d08.appspot.com",
  messagingSenderId: "899936317660",
  appId: "1:899936317660:web:f2196b070be9afafb4c419",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  db,
  setDoc,
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
};