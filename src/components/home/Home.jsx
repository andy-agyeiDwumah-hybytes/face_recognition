// React
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
// Context
import { UserContext } from "../../context/userContext";
// Styles
import styles from "./Home.module.css";
// Components
import SetupFaceRecognition from "../setUpFaceRecognition/SetUpFaceRecognition";
import DeleteAccountPopover from "../deleteAccountPopover/deleteAccountPopover";
// Utils
import { signOutUser } from "../../utils/authUtils";
// React toastify
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [stream, setStream] = useState(null); // Store video stream
  const popoverRef = useRef();
  const firstElementInPopover = useRef();
  const lastElementInPopover = useRef();

  useEffect(() => {
    const trapModalFocus = e => {
      // Store elements that have a tab index inside modal
      const focusableElements = popoverRef?.current.querySelectorAll("button");
      firstElementInPopover.current = focusableElements[0];
      lastElementInPopover.current =
        focusableElements[focusableElements.length - 1];
      // Check for forward tabbing
      if (
        document.activeElement === lastElementInPopover.current &&
        e.key === "Tab" &&
        !e.shiftKey
      ) {
        e.preventDefault(); // ! Prevent the default tab behavior
        firstElementInPopover.current.focus();
      }
      // Check for reverse tabbing (shift + tab)
      if (
        document.activeElement === firstElementInPopover.current &&
        e.key === "Tab" &&
        e.shiftKey
      ) {
        e.preventDefault();
        lastElementInPopover.current.focus();
      }
    };
    document.addEventListener("keydown", trapModalFocus);
    return () => document.removeEventListener("keydown", trapModalFocus);
  });

  const handleCancelVideo = () => {
    // Stop all tracks
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const handleSignOut = async () => {
    try {
      // Stop video (if on) when user signs out
      if (stream) {
        handleCancelVideo();
      }
      await signOutUser();
      navigate("/");
    } catch (e) {
      console.error(`(Home.jsx): ${e}`);
      toast.error(
        "We encountered an issue while logging you out of your account. Please try again."
      );
    }
  };

  const handleShowModal = () => {
    popoverRef.current.showModal();
  };

  return (
    <section className={styles.section} aria-label="Home">
      <div className={styles.greetingWrapper}>
        <p>
          Hello, <span className={styles.userEmail}>{user.email}</span>
        </p>
      </div>
      <SetupFaceRecognition
        user={user}
        stream={stream}
        setStream={setStream}
        handleCancelVideo={handleCancelVideo}
      />
      <div className={styles.signOutBtnWrapper}>
        <h3>Sign Out</h3>
        <button
          type="button"
          onClick={handleSignOut}
          className={styles.signOutBtn}
        >
          Sign out?
        </button>
      </div>
      <div className={styles.deleteAccountWrapper}>
        <h3>Delete Account</h3>
        <button
          type="button"
          className={styles.deleteAccountBtn}
          onClick={handleShowModal}
        >
          Delete account
        </button>
      </div>
      <DeleteAccountPopover
        popoverRef={popoverRef}
        stream={stream}
        handleCancelVideo={handleCancelVideo}
      />
    </section>
  );
}
