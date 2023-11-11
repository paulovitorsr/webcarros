import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBILdqehSzN4b5jqC597QO3fAm-jm6Hews",
  authDomain: "webcarros-6984e.firebaseapp.com",
  projectId: "webcarros-6984e",
  storageBucket: "webcarros-6984e.appspot.com",
  messagingSenderId: "844365148615",
  appId: "1:844365148615:web:2c5d5026ab1599a969e9e2"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db, auth, storage};