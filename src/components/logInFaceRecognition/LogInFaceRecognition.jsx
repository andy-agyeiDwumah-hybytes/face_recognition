// React
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
// Face API
import * as faceapi from "face-api.js";
// Context
import { UserContext } from "../../context/userContext";
// Styles
import styles from "./LogInFaceRecognition.module.css"
// Utils
import { drawVideoFrameOnCanvas } from "../../utils/canvasUtils";
import { getUserPassword, logInUser, matchDetectedFace } from "../../utils/authUtils";
// React toastify
import { toast } from "react-toastify";

export default function LogInFaceRecognition({
  handleCancelVideo,
  videoRef,
  popOverRef,
}) {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [userIsLoggingIn, setUserIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    setUserIsLoggingIn(true);
    console.log("(LogInFaceRecognition.jsx) Face is scanning...");
    // Set up canvas to capture a fresh snapshot from the video
    const canvas = drawVideoFrameOnCanvas(videoRef.current);
    const detections = await faceapi
      .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    // * Simulate login delay (not really necessary, just for experience)
    // await new Promise(resolve => setTimeout(resolve, 2000));
    if (!detections) {
      setUserIsLoggingIn(false);
      handleCancelVideo(); // Hide video
      toast.error(
        "No face detected. Try better lighting or adjust the camera angle."
      );
    } else {
      try {
        const bestMatch = await matchDetectedFace(faceapi, detections);
        if (bestMatch) {
          console.log("best match :", bestMatch)
          // * Make sure to log in user using face detection
          const userPassword = await getUserPassword(bestMatch.email)
          const userCredential = await logInUser(bestMatch.email, userPassword);
          setUser({ uid: userCredential.uid, email: userCredential.email });
          toast.success("Face ID Login was successful.");
          navigate("/home");
        } else {
          toast.error("Face not recognised.");
        }
      } catch (e) {
        console.error(`(LogInFaceRecognition.jsx): ${e}`);
        // Also for accounts that are disabled 
        toast.error("There was an error fetching Face Recognition data.");
      } finally {
        setUserIsLoggingIn(false);
        handleCancelVideo();
      }
    }
  };

  return (
    <dialog
      ref={popOverRef}
      className={[styles.videoWrapper, "popover"].join(" ")}
    >
      <video ref={videoRef} muted autoPlay className={styles.video}></video>
      <div className={styles.btnWrapper}>
        <button
          type="button"
          onClick={handleLogin}
          disabled={userIsLoggingIn}
          className={[styles.btn, styles.startScanningBtn].join(" ")}
        >
          Start scanning
        </button>
        <button
          type="button"
          onClick={handleCancelVideo}
          disabled={userIsLoggingIn}
          className={styles.btn}
        >
          Cancel
        </button>
      </div>
      {userIsLoggingIn && (
        <p className={styles.scanningText}>Scanning face...</p>
      )}
    </dialog>
  );
}
