import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDUFwT8zpFouS35m4UYbrpdehn-wUJGCDY",
  authDomain: "fit5032-5449a.firebaseapp.com",
  projectId: "fit5032-5449a",
  storageBucket: "fit5032-5449a.firebasestorage.app",
  messagingSenderId: "66905204340",
  appId: "1:66905204340:web:d7aff353d07f99bbe7d321"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default db;
