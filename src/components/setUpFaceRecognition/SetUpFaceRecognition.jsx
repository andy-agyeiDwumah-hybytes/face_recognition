// React
import { useEffect, useRef, useState } from "react";
// Face API
import * as faceapi from "face-api.js";
// Styles
import styles from "./SetupFaceRecognition.module.css";
// Utils
import {
  storeFaceDetails,
  checkUserHasFaceDetailsSetUp,
} from "../../utils/authUtils";
// React toastify
import { toast } from "react-toastify";

export default function SetupFaceRecognition({ user }) {
  const videoRef = useRef();
  const [stream, setStream] = useState(null); // Store video stream
  const [faceRecognitionSetUp, setFaceRecognitionSetUp] = useState(false);
  const [isSettingUpFaceRecognition, setIsSettingUpFaceRecognition] =
    useState(false);

  useEffect(() => {
    const checkFaceRecognitionSetUp = async () => {
      if (!user) return; // Ensure user exists before querying
      try {
        const faceDetailsSetUp = await checkUserHasFaceDetailsSetUp(user);
        faceDetailsSetUp
          ? setFaceRecognitionSetUp(true)
          : setFaceRecognitionSetUp(false);
      } catch (e) {
        console.error(`(SetUpFace.jsx): ${e}`);
        toast.error("Error fetching Face Recognition data.")
      }
    };
    checkFaceRecognitionSetUp();
  }, [user]);

  const handleStartCamera = async () => {
    // Get access to user's camera and show real time video
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      console.log("(SetUpFace.jsx) Video stream obtained:\n", userStream);
      videoRef.current.srcObject = userStream;
      setStream(userStream);
    } catch (e) {
      console.error(`(SetUpFace.jsx): ${e}`);
      toast.error("Please allow camera access to set up Face Recognition.");
    }
  };

  const handleCancelVideo = () => {
    if (stream) {
      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleFaceRecognition = async () => {
    setIsSettingUpFaceRecognition(true);
    // * Simulate login delay (not really necessary, just for experience)
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      await storeFaceDetails(faceapi, user, videoRef, handleCancelVideo, toast);
    } catch (e) {
      console.error(`(SetUpFace.jsx): ${e}`);
      toast.error("There was an error. Please try again.")
    } finally {
      setIsSettingUpFaceRecognition(false);
    }
  };

  return (
    <div className={styles.setUpFaceWrapper}>
      <h2>Face recognition</h2>
      {faceRecognitionSetUp && <p>Face recognition has been set up</p>}
      {/* Show video only when user wants to set up face detection */}
      <video
        ref={videoRef}
        muted
        autoPlay
        className={[
          styles.video,
          stream ? styles.showVideo : styles.hideVideo,
        ].join(" ")}
      />
      <button
        type="button"
        className={styles.setUpFaceBtn}
        onClick={stream ? handleFaceRecognition : handleStartCamera}
        disabled={isSettingUpFaceRecognition}
      >
        {stream ? "Start scanning" : "Set up face recognition"}
      </button>
      {stream && (
        <button
          type="button"
          onClick={handleCancelVideo}
          className={styles.cancelBtn}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
