// React
import { useNavigate } from "react-router";
// Utils
import { deleteAccount } from "../../utils/authUtils";
// React toastify
import { toast } from "react-toastify";
// Firebase
import { auth } from "../../firebase";
// Styles
import styles from "./DeleteAccountPopover.module.css";

export default function DeleteAccountPopover({
  popoverRef,
  stream,
  handleCancelVideo,
}) {
  const navigate = useNavigate();

  const handleDeleteAccount = async (currentUser) => {
    try {
      // Stop video (if on) when user deletes account
      if (stream) {
        handleCancelVideo();
      }
      await deleteAccount(currentUser);
      navigate("/");
      toast.success("Account was successfully deleted.");
    } catch (e) {
      console.error(`(Home.jsx): ${e}`);
      toast.error(
        "We encountered an issue while deleting your account. Please try again."
      );
    }
  };

  const handleCloseModal = () => {
    popoverRef.current.close();
  };

  return (
    <dialog ref={popoverRef} className={[styles.dialog, "popover"].join(" ")}>
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
        onClick={handleCloseModal}
        className={[styles.btn, styles.cancelBtn].join(" ")}
      >
        Cancel
      </button>
    </dialog>
  );
}
