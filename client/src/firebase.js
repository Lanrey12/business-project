// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "business-project-7f3fa.firebaseapp.com",
  projectId: "business-project-7f3fa",
  storageBucket: "business-project-7f3fa.appspot.com",
  messagingSenderId: "1034770702256",
  appId: "1:1034770702256:web:55d25f49075cf3b297c075"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);