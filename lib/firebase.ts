// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCHj_0A304WO1tHaMaV0K0fzQEF5FUdNqU",
  authDomain: "wedding-invitation-e7404.firebaseapp.com",
  projectId: "wedding-invitation-e7404",
  storageBucket: "wedding-invitation-e7404.firebasestorage.app",
  messagingSenderId: "111281669304",
  appId: "1:111281669304:web:ea0c65a8050bc4e142604d",
  databaseURL: 'https://wedding-invitation-e7404-default-rtdb.asia-southeast1.firebasedatabase.app'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
