// React
import { useContext } from "react";
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
      <DeleteAccountPopover />
    </section>
  );
}
