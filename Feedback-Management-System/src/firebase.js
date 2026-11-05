
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAM5PgMzw1arJfsJOjkczryR9d49zgcqkE",
  storageBucket: "feedback-management-syst-d8204.firebasestorage.app",
  messagingSenderId: "969824595176",
    authDomain: "feedback-management-syst-d8204.firebaseapp.com",
  projectId: "feedback-management-syst-d8204",
appId: "1:969824595176:web:f0e2cb55f0494864ebad5d",
  measurementId: "G-MFFYVQC3BH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
