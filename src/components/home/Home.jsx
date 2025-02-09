// React
import { useContext, useRef } from "react";
import { useNavigate } from "react-router";
// Context
import { UserContext } from "../../context/userContext";
// Styles
import styles from "./Home.module.css";
// Components
import SetupFaceRecognition from "../setUpFaceRecognition/SetUpFaceRecognition";
// Utils
import { deleteAccount, signOutUser } from "../../utils/authUtils";
// React toastify
import { toast } from "react-toastify";
// Firebase
import { auth } from "../../firebase";

export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const popoverRef = useRef()

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/");
    } catch (e) {
      console.error(`(Home.jsx): ${e}`);
      toast.error(
        "We encountered an issue while logging you out of your account. Please try again."
      );
    }
  };

  const handleDeleteAccount = async currentUser => {
    try {
      await deleteAccount(currentUser)
      navigate("/")
      toast.success("Account was successfully deleted.")
    } catch (e) {
      console.error(`(Home.jsx): ${e}`)
      toast.error(
        "We encountered an issue while deleting your account. Please try again."
      );
    }
  }

  const handleClick = () => {
    popoverRef.current.hidePopover()
  }

  return (
    <section className={styles.section} aria-label="Home">
      <div className={styles.greetingWrapper}>
        <p>
          Hello, <span className={styles.userEmail}>{user.email}</span>
        </p>
      </div>
      <SetupFaceRecognition user={user} />
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
          popoverTarget="deletePopover"
        >
          Delete account
        </button>
      </div>
      <div
        ref={popoverRef}
        popover="auto"
        id="deletePopover"
        className={styles.popover}
      >
        <h4 className={styles.deleteHeading}>
          Are you sure you would like to delete your account? This action cannot
          be undone.
        </h4>
        <button
          type="button"
          className={[styles.btn, styles.confirmBtn].join(" ")}
          onClick={() => handleDeleteAccount(auth.currentUser)}
        >
          Delete
        </button>
        <button
          type="button"
          onClick={handleClick}
          className={[styles.btn, styles.cancelBtn].join(" ")}>
          Cancel
        </button>
      </div>
    </section>
  );
}
