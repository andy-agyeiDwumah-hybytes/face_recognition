// Components
import LogInFaceRecognition from "../logInFaceRecognition/LogInFaceRecognition";
import FormBtn from "../formBtn/FormBtn";
import LogInFaceBtn from "../logInFaceBtn/LogInFaceBtn";
// React
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
// Styles
import styles from "./AuthForm.module.css";
// React toastify
import { toast } from "react-toastify";
// Firebase
import { validatePassword } from "firebase/auth";
import { auth } from "../../firebase";
// Utils
import { displayPasswordPolicy } from "../../utils/passwordUtils";

export default function AuthForm({
  handleSubmit,
  handleClick,
  isLogin,
  EMAILREGEXPATTERN,
  email,
  setEmail,
  emailPattern,
  emailError,
  formHasBeenSubmitted,
  password,
  setPassword,
  setPasswordError,
  passwordError,
  confirmPassword,
  setConfirmPassword,
  formRef,
}) {
  const [stream, setStream] = useState(null); // Store video stream
  const videoRef = useRef();
  const popOverRef = useRef();

  useEffect(() => {
    const cancelVideo = e => {
      // Close video when click is detected outside popover element
      if (
        stream &&
        e.target !== popOverRef.current &&
        e.target !== videoRef.current
      ) {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    };
    document.addEventListener("click", cancelVideo);
    return () => document.removeEventListener("click", cancelVideo);
  });

  const handleCancelVideo = () => {
    // Stop all tracks
    stream.getTracks().forEach(track => track.stop());
    setStream(null);
    // Manually hide popover
    popOverRef.current.hidePopover();
  };

  const handlePasswordChange = async (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    // No need to show password policy for users that already have an account
    if (!isLogin) {
      const userPasswordStatus = await validatePassword(auth, newPassword.trim());
      const passwordPolicy =
      userPasswordStatus.passwordPolicy.customStrengthOptions;
      
      if (!userPasswordStatus.isValid) {
        const text = displayPasswordPolicy(userPasswordStatus, passwordPolicy)
        setPasswordError(text)
      } else {
        setPasswordError("")
      }
    }
  }

  return (
    <>
      <form
        aria-labelledby="form-heading"
        className={styles.form}
        noValidate
        action={handleSubmit}
        ref={formRef}
      >
        <h1 id="form-heading" className={styles.heading}>
          {isLogin ? "Log In" : "Sign Up"}
        </h1>
        <div className={styles.formContentWrapper}>
          <div className={styles.faceIdWrapper}>
            <h2 className={styles.heading}>
              {isLogin ? "Welcome Back!" : "Get Started Below"}
            </h2>
            <div
              className={[
                styles.img,
                isLogin ? styles.logInImg : styles.signUpImg,
              ].join(" ")}
            ></div>
            {/* Show button to log in with face detection only for those with an account */}
            {isLogin && (
              <>
                <LogInFaceBtn
                  videoRef={videoRef}
                  setStream={setStream}
                  toast={toast}
                  popOverRef={popOverRef}
                />
                <p className={styles.paraDivider}>or</p>
              </>
            )}
          </div>
          {/* A wrapper to contain interactive elements */}
          {/* When video is on, disable all user input events for the element to prevent keyboard navigation */}
          <div inert={stream}>
            <div className={styles.labelInputWrapper}>
              <label htmlFor="email" className={styles.label}>
                Email:{" "}
              </label>
              <input
                type="email"
                inputMode="email"
                name="email"
                id="email"
                pattern={EMAILREGEXPATTERN}
                placeholder="johnDoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            {formHasBeenSubmitted && !emailPattern.test(email.trim()) && (
              <p className={styles.error}>{emailError}</p>
            )}
            <div className={styles.labelInputWrapper}>
              <label htmlFor="password" className={styles.label}>
                Password:{" "}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="**************"
                value={password}
                onChange={handlePasswordChange}
                className={styles.input}
                required
              />
            </div>
            {/* Show 'confirm password' field for users who do not have an account */}
            {!isLogin && (
              <div className={styles.labelInputWrapper}>
                <label htmlFor="passwordConfirm" className={styles.label}>
                  Confirm Password:{" "}
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  placeholder="**************"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            )}
            {formHasBeenSubmitted && passwordError && (
              <p className={styles.error}>{passwordError}</p>
            )}
            <div className={styles.forgotPasswordWrapper}>
              <Link to="/" className={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
            <div className={styles.btnWrapper}>
              <FormBtn
                type="submit"
                className={[styles.btn, styles.btnSubmit].join(" ")}
              >
                {isLogin ? "Log In" : "Sign Up"}
              </FormBtn>
              <FormBtn
                type="button"
                className={[styles.btn, styles.btnToggleFormStatus].join(" ")}
                handleClick={handleClick}
              >
                {isLogin ? "Sign Up?" : "Log In?"}
              </FormBtn>
            </div>
          </div>
        </div>
      </form>
      <LogInFaceRecognition
        handleCancelVideo={handleCancelVideo}
        videoRef={videoRef}
        popOverRef={popOverRef}
      />
    </>
  );
}
