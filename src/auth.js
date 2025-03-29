import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import app from "./firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
setPersistence(auth, browserLocalPersistence);

export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user details in Firestore with role = "user"
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role: "user", // Default role
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};
