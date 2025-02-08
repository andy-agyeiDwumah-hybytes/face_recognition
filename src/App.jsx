// React
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import { useEffect, useState } from "react";
// Pages
import LogInPage from "./pages/LogInPage"
import HomePage from "./pages/HomePage"
// Components
import Layout from "./components/layout/Layout";
import PrivateRoutes from "./components/privateRoutes/PrivateRoutes";
// Context
import { UserContext } from "./context/userContext";
// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
// Face API
import * as faceapi from "face-api.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<LogInPage />} />
      <Route element={<PrivateRoutes />}>
        <Route path="home" element={<HomePage />} />
      </Route>
    </Route>
  )
);

export default function App() {
  const [user, setUser] = useState(null);
  // Set true only when Firebase has determined the authentication state
  // If a user is logged in or not
  const [authIsReady, setAuthIsReady] = useState(false);

  useEffect(() => {
    // Load models from public/models
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        console.log("(App.jsx) Face-api models loaded successfully.");
      } catch (e) {
        console.error("(App.jsx) Error loading Face-api models: ", e);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, userData => {
      // Check if user is signed in
      if (userData) {
        console.log("(App.jsx) User is signed in:\n", userData);
        setUser({ uid: userData.uid, email: userData.email });
      } else {
        console.log("(App.jsx) User not signed in or has signed out.");
        setUser(null);
      }
      // Firebase has finished checking the auth state
      setAuthIsReady(true);
    });
    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []);

  const appContext = {
    user,
    setUser,
    authIsReady,
  };

  return (
    <UserContext value={appContext}>
      <RouterProvider router={router} />
    </UserContext>
  );
}
