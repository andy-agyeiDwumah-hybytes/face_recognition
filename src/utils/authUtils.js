// Firebase
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, firestore } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
// Constants
import { FACEDATA, USERS } from "../constants/Constants";

// FIREBASE
export const signUpUser = async (email, password) => {
  const querySnapshot = await getDocs(collection(firestore, USERS));
  for (const doc of querySnapshot.docs) {
    const userData = doc.data();
    // Checks if email provided already exists within Cloud Firestore database
    if (userData.email === email) {
      throw new Error("Email already exists.");
    }
  }
  // Create new user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const newUser = userCredential.user;
  // Store user data in Firestore under 'users' collection
  await setDoc(doc(firestore, USERS, newUser.uid), {
    email: email,
    password: password,
    uid: newUser.uid,
  });
  return newUser;
};

export const logInUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const getUserPassword = async email => {
  // Get user information
  // 'limit 1' - Query will always return one document
  // as 'matchDetectedFace' function returns a single object
  const q = query(
    collection(firestore, USERS),
    where("email", "==", email),
    limit(1)
  );

  let userDoc;
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    userDoc = doc.data()
  })
  return userDoc.password;
};

// FIREBASE + FACEAPI
export const matchDetectedFace = async (faceapi, detections) => {
  // Fetch all face data from FACEDATA collection
  const querySnapshot = await getDocs(collection(firestore, FACEDATA));
  let bestMatch = null;
  let lowestDistance = 0.4;
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    const descriptor = new Float32Array(userData?.descriptor);

    // Calculate Euclidean distance between detected face and stored face
    const distance = faceapi.euclideanDistance(
      detections.descriptor,
      descriptor
    );
    console.log(`Email: ${userData.email}\nDistance: ${distance}`);
    // If distance is within the threshold and is the lowest so far, store as best match
    // The lower, the closest to detected face
    if (distance < lowestDistance) {
      lowestDistance = distance;
      bestMatch = { uid: doc.id, email: userData.email };
    }
  });
  return bestMatch;
};

export const storeFaceDetails = async (
  faceapi,
  user,
  canvas,
  handleCancelVideo,
  toast
) => {
  const detections = await faceapi
    .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  // Check if software has found a face
  if (detections) {
    const faceDescriptor = detections.descriptor;
    console.log(
      "(SetUpFace.jsx) Face detected. Your details: \n",
      faceDescriptor
    );
    // Store in database
    await setDoc(doc(firestore, FACEDATA, user.uid), {
      // Convert Float32Array to array
      descriptor: Array.from(faceDescriptor),
      faceRecognitionSetUp: true,
      email: user.email,
    });
    toast.success("Face Recognition Setup was successful.");
    handleCancelVideo();
  } else {
    toast.error(
      "No face detected. Try better lighting or adjust the camera angle."
    );
  }
};

export const checkUserHasFaceDetailsSetUp = async user => {
  const docRef = doc(firestore, FACEDATA, user.uid);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? true : false;
};

export const deleteAccount = async user => {
  // Handle Firestore deletions atomically
  const batch = writeBatch(firestore)
  // Delete Firestore documents associated with the user
  batch.delete(doc(firestore, USERS, user.uid))
  batch.delete(doc(firestore, FACEDATA, user.uid))
  
  // Commit Firestore deletions
  await batch.commit()

  // Delete user
  await deleteUser(user);
}