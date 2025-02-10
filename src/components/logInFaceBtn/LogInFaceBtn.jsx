// Styles
import styles from "./LogInFaceBtn.module.css";

export default function LogInFaceBtn({ videoRef, setStream, toast, popOverRef }) {
  const handleStartCamera = async () => {
    // Get access to user's camera and show real time video
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      console.log("(AuthForm.jsx) Video stream obtained:\n", userStream);
      videoRef.current.srcObject = userStream;
      setStream(userStream);
    } catch (e) {
      console.error(`(AuthForm.jsx): ${e}`);
      toast.error("Please allow camera access to set up Face Recognition.");
      // If user denies access hide popover
      popOverRef.current.hidePopover()
    }
  };

  return (
    <button
      type="button"
      className={styles.faceIdBtn}
      onClick={handleStartCamera}
      popoverTarget="my-popover"
    >
      Log in with face id
    </button>
  );
}
