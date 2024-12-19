import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";

const API_URL = "http://127.0.0.1:5000"; // URL backend locale
//const API_URL = "http://34.122.99.160:5000";

// Funzione per il login
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : error.message);
  }
};

// Funzione per caricare una radiografia
export const uploadRadiograph = async (patientId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("patientId", patientId); // Aggiunto l'ID paziente ai formData
  console.log("PatientID: " + patientId);

  try {
    const response = await axios.post(
      `${API_URL}/api/patients/${patientId}/radiographs`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    // Aggiungi maggiori dettagli all'errore
    console.error("Errore durante il caricamento:", error);
    throw new Error(error.response ? error.response.data.error : error.message);
  }
};

// Funzione per ottenere i pazienti associati a un dottore specifico
export const getPatientsFromDoctor = async (doctorId) => {
  try {
    const response = await axios.get(`${API_URL}/api/${doctorId}/patients`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Errore:", error);
    return [];
  }
};

// Funzione per ottenere le radiografie di un paziente
export const getRadiographs = async (patientId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/patients/${patientId}/radiographs`
    );
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero delle radiografie:", error);
    throw error;
  }
};

export const loadRadiographiesForPatient = async (patientId) => {
  try {
    const response = await axios.get(`${API_URL}/get_radiographs/${patientId}`);
    return response.data;
  } catch (error) {
    console.log("Errore nel recupero delle radiografie:", error);
    throw error;
  }
};

// Funzione per ottenere le informazioni della radiografia da un file info.txt
export const getRadiographyInformation = async (uid, idx) => {
  try {
    const response = await axios.get(
      `${API_URL}/get_radiographs_info/${uid}/${idx}`
    );
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero delle radiografie:", error);
    throw error;
  }
};

// Funzione per verificare l'email
export const verifyEmail = async (uid) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:5000/verify-email/${uid}`
    );
    return response;
  } catch (error) {
    console.error(
      error.response?.data?.error || "Errore durante la verifica dell'email."
    );
    throw error;
  }
};

// Funzione per controllare se l'email è stata verificata
export const checkEmailVerification = async (email) => {
  try {
    await axios.post("http://127.0.0.1:5000/check-email-verification", {
      email: email,
    });
    return "";
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 403:
          return "La tua email non è stata verificata. Verifica la tua email prima di accedere.";
        case 404:
          return "Utente non trovato. Controlla le credenziali.";
        case 400:
          return "Inserire email.";
        default:
          return (
            error.response.data.error || "Errore nella verifica dell'email."
          );
      }
    } else {
      return "Errore di connessione. Riprova più tardi.";
    }
  }
};

// Funzione per decrementare i tentativi di login
export const decrementLoginAttempts = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/decrement-attempts`, {
      email: email,
    });
    return response.data;
  } catch (error) {
    console.error("Errore durante il decremento dei tentativi:", error);
    throw error;
  }
};

// Funzione per il login
export const signInUser = async (auth, user, psw) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, user, psw);

    const userData = userCredential.user;

    return userData; // Return user object
  } catch (error) {
    console.error("Errore durante il login:", error);
    //handleError(error);
    throw error;
    //return null; // Return null if failed
  }
};

// Funzione per il login con token
export const login = async (token) => {
  const response = await axios.post("http://127.0.0.1:5000/login", {
    idToken: token,
  });
  return response;
};

export const getAttemptsLeft = async (email) => {
  const response = await axios.post("http://127.0.0.1:5000/get-attempts-left", {
    email: email,
  });
  return response.data.loginAttemptsLeft;
};

export const sendPasswordResetEmail = async (email) => {
  await axios.post("http://127.0.0.1:5000/send-reset-email", {
    email: email,
  });
};

export const resetPassword = async (uid, password) => {
  await axios.post("http://127.0.0.1:5000/reset-password", {
    uid: uid,
    password: password,
  });
};

// Funzione per ottenere i dottori
export const fetchDoctors = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/doctors`);
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei dottori:", error);
    throw error;
  }
};

// Funzione per ottenere i pazienti
export const fetchPatients = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/patients`);
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei pazienti:", error);
    throw error;
  }
};

// Funzione per inviare una notifica
export const fetchNotifications = async (data) => {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    return response;
  } catch (error) {
    console.error("Errore nell'invio della notifica:", error);
    alert("Errore nell'invio della notifica.");
    throw error;
  }
};

// Funzione per salvare un'operazione
export const saveOperations = async (data) => {
  try {
    const response = await fetch("/api/operations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    return response;
  } catch (error) {
    console.error("Errore durante la pianificazione dell'operazione:", error);
    alert("Errore: " + error.message);
    throw error;
  }
};

// Funzione per caricare tutti i dati dei pazienti
export const loadPatientsData = async (doctorId) => {
  try {
    const response = await fetch(`/api/${doctorId}/patients`);
    return response;
  } catch (error) {
    console.error("Errore nel caricamento dei pazienti:", error);
    throw error;
  }
};

// Funzione per caricare operazioni e radiografie
export const loadOperationsAndRadiographs = async (patientId) => {
  try {
    const [operationsResponse, radiographsResponse, patientResponse] =
      await Promise.all([
        fetch(`/api/patients/${patientId}/operations`),
        fetch(`/api/patients/${patientId}/radiographs`),
        fetch(`/api/get_user/${patientId}`), // Nuova chiamata per recuperare i dettagli del paziente
      ]);
    return [operationsResponse, radiographsResponse, patientResponse];
  } catch (error) {
    console.error("Errore di connessione al server:", error);
    throw error;
  }
};

// Funzione per recuperare le notifiche
export const getNotifications = async (userId) => {
  try {
    const response = await fetch(`/api/notifications?patientId=${userId}`);
    return response;
  } catch (error) {
    console.error("Errore nel recupero delle notifiche:", error);
    throw error;
  }
};

// Funzione per segnare la notifiche come lette
export const patchNotifications = async (notificationId, isRead) => {
  try {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: isRead,
    });
    return response;
  } catch (error) {
    console.error("Errore nel recupero delle notifiche:", error);
    throw error;
  }
};

// Funzione per registrare un utente
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Errore nella registrazione:", error);
    throw error;
  }
};

export async function predictImage(formData) {
  try {
    const response = await axios.post(`${API_URL}/predict`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error predicting image:", error);
    throw error;
  }
}

export async function uploadToDataset(formData) {
  try {
    await axios.post(`${API_URL}/upload-to-dataset`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("File caricato con successo nella cartella dataset.");
  } catch (error) {
    console.error("Errore durante il caricamento del file:", error);
    throw error;
  }
}

// Funzione per ottenere i dati dell'utente
export const getUserData = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/get_user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error);
    throw error;
  }
};

// Funzione per aggiornare i dati dell'utente
export const updateUserData = async (userId, field, value) => {
  try {
    const payload = { userId, [field]: value };
    const response = await axios.patch(`${API_URL}/update_user`, payload);
    return response.data;
  } catch (error) {
    console.error("Errore durante l'aggiornamento dei dati utente:", error);
    throw error;
  }
};
