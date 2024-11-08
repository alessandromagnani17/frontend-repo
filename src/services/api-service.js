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
    const response = await axios.get(`/api/${doctorId}/patients`, {
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
    console.log("Errore nel recuperosdds delle radiografie:", error);
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
  }
};
