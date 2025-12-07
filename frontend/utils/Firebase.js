import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
 authDomain: "loginonecart-2040f.firebaseapp.com",
  projectId: "loginonecart-2040f",
  storageBucket: "loginonecart-2040f.firebasestorage.app",
  messagingSenderId: "619513605830",
  appId: "1:619513605830:web:72abc6f87ca009028b31c7"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth , provider}

