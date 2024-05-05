import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  ActionCodeSettings,
} from "firebase/auth";
import { auth } from "./firebase";
import sendUserToDB from "./sendUser";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<UserCredential> => {
  console.log("SignUP: ", firstName, lastName);
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const firebaseUserId = userCredential.user.uid; // Get the Firebase user ID

  await sendUserToDB(firebaseUserId, firstName, lastName);
  return userCredential;
};

export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async (): Promise<UserCredential> => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const doSignOut = async (): Promise<void> => {
  return auth.signOut();
};

export const doPasswordReset = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = async (password: string): Promise<void> => {
  if (auth.currentUser) {
    return updatePassword(auth.currentUser, password);
  } else {
    throw new Error("No user is currently signed in.");
  }
};

export const doSendEmailVerification = async (): Promise<void> => {
  if (auth.currentUser) {
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/home`,
    };
    return sendEmailVerification(auth.currentUser, actionCodeSettings);
  } else {
    throw new Error("No user is currently signed in.");
  }
};
