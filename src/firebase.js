// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa il modulo di autenticazione
import { getFirestore } from "firebase/firestore"; // Importa il modulo Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_MQy_185bQyKR2-SOJ_nupGIbGyNhP7U",
  authDomain: "osteoarthritis-portal.firebaseapp.com",
  projectId: "osteoarthritis-portal",
  storageBucket: "osteoarthritis-portal.firebasestorage.app",
  messagingSenderId: "621576607313",
  appId: "1:621576607313:web:671b842e688f1b23954a70",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app); // Crea l'oggetto auth

// Initialize Firestore
const db = getFirestore(app); // Crea l'oggetto db per Firestore

// Esporta sia l'oggetto auth che l'oggetto db e la funzione di login
export { auth, db };
