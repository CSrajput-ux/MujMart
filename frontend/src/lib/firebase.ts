// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbuA9XLU_HkRhis-ju9TM9tmU6zp6EZIc",
  authDomain: "mujmart-3d824.firebaseapp.com",
  projectId: "mujmart-3d824",
  storageBucket: "mujmart-3d824.firebasestorage.app",
  messagingSenderId: "674175494628",
  appId: "1:674175494628:web:f6bf27ed6455d6fda7fff1",
  measurementId: "G-XF77SWB1E2"
};

// Initialize Firebase (singleton pattern for Next.js SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export default app;
