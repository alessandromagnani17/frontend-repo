// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Importa il modulo di autenticazione
import { getFirestore } from "firebase/firestore"; // Importa il modulo Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAq_qPlErbns4jjLmCBrcuJLwnWmDxvrY",
  authDomain: "osteoarthritis-project.firebaseapp.com",
  projectId: "osteoarthritis-project",
  storageBucket: "osteoarthritis-project.firebasestorage.app",
  messagingSenderId: "632479646844",
  appId: "1:632479646844:web:87cdabce1909352bb135f9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app); // Crea l'oggetto auth

// Initialize Firestore
const db = getFirestore(app); // Crea l'oggetto db per Firestore

// Esporta sia l'oggetto auth che l'oggetto db e la funzione di login
export { auth, db };
