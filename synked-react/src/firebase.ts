import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAEjPL46k_D_NWIKaLzjuPoWVPuxqB0-yI",
  authDomain: "synked-ai.firebaseapp.com",
  projectId: "synked-ai",
  storageBucket: "synked-ai.firebasestorage.app",
  messagingSenderId: "757259534125",
  appId: "1:757259534125:web:e30923d23bfb2cfcc81da4",
  measurementId: "G-ZC5VCSBX2X",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
