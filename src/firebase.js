// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa il modulo di autenticazione
import { getFirestore } from "firebase/firestore"; // Importa il modulo Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDron87U_PasTdrtOBfnntXUptPNT-3xQ",
  authDomain: "osteoarthritis-provolone.firebaseapp.com",
  projectId: "osteoarthritis-provolone",
  storageBucket: "osteoarthritis-provolone.appspot.com",
  messagingSenderId: "111916507074",
  appId: "1:111916507074:web:afaa3c072f75840767005b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app); // Crea l'oggetto auth

// Initialize Firestore
const db = getFirestore(app); // Crea l'oggetto db per Firestore

// Esporta sia l'oggetto auth che l'oggetto db e la funzione di login
export { auth, db };
