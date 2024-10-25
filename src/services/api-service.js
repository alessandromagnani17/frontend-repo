import axios from "axios";

const API_URL = "http://localhost:5000"; // URL del tuo backend

// Funzione per la registrazione
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.error : error.message);
  }
};

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
    console.log("DOPO DEL TRY");

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
export async function getPatientsFromDoctor(doctorId) {
  try {
    const response = await fetch(`/api/${doctorId}/patients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Errore nel recupero dei pazienti.");
    }

    const patients = await response.json();
    return patients;
  } catch (error) {
    console.error("Errore:", error);
    return [];
  }
}

// Funzione per ottenere le radiografie di un paziente
export const getRadiographs = async (patientId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/patients/${patientId}/radiographs`
    );
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero delle radiografie:", error);
    throw error; // Rilancia l'errore per gestirlo più in alto nella chiamata
  }
};
