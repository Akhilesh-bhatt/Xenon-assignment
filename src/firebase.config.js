// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB-jrhynei-wnE9QSdP_g0k582R7JDf344",
  authDomain: "house-marketplace-app-632ce.firebaseapp.com",
  projectId: "house-marketplace-app-632ce",
  storageBucket: "house-marketplace-app-632ce.appspot.com",
  messagingSenderId: "757534614044",
  appId: "1:757534614044:web:a3d9cad1602d76056775d9"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()