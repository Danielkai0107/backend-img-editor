// /lib/firebase.js

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAeKCPut2K8BXCKdkDZ9JTEsJ4qtVrQ8c",
  authDomain: "test-49fb9.firebaseapp.com",
  projectId: "test-49fb9",
  storageBucket: "test-49fb9.appspot.com",
  messagingSenderId: "36864241716",
  appId: "1:36864241716:web:42198972d8fe5268d4da61"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Export the initialized storage
export const storage = getStorage();
