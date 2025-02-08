// React
import { useContext } from "react";
import { useNavigate } from "react-router";
// Context
import { UserContext } from "../../context/userContext";
// Styles
import styles from "./Home.module.css";
// Components
import SetupFaceRecognition from "../setUpFaceRecognition/SetUpFaceRecognition";
// Utils
import { signOutUser } from "../../utils/authUtils";
// React toastify
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      signOutUser();
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
        <button
          type="button"
          onClick={handleClick}
          className={styles.signOutBtn}
        >
          Sign out?
        </button>
      </div>
    </section>
  );
}
