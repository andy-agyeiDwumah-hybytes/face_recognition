// Components
import AuthForm from "../authForm/AuthForm";
// Constants
import { EMAILREGEXPATTERN, EMAILPATTERN } from "../../constants/Constants";
// React
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router";
// Context
import { UserContext } from "../../context/userContext";
// Utils
import { signUpUser, logInUser } from "../../utils/authUtils";
import { displayPasswordPolicy } from "../../utils/passwordUtils";
// React toastfiy
import { toast } from "react-toastify";
// Firebase
import { validatePassword } from "firebase/auth";
import { auth } from "../../firebase";

// Error messages
const bothPasswordFieldsRequired = "Both password fields are required";
const emailErrorText =
  "Please enter a valid email address in the format: example@domain.com (e.g., johnDoe@email.com).";
const passwordFieldIsRequired = "Password field is required";

export default function Form() {
  const formRef = useRef();
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [formHasBeenSubmitted, setFormHasBeenSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleClick = () => {
    setIsLogin(prev => !prev);
    // Reset state, input fields, and error messages
    // when changing between 'Log in' and 'Sign Up'
    setFormHasBeenSubmitted(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setEmailError("");
  };

  const handleSignUp = async formData => {
    const userEmail = formData.get("email").trim();
    const userPassword = formData.get("password").trim();
    const userConfirmPassword = formData.get("passwordConfirm").trim();
    const userPasswordStatus = await validatePassword(auth, userPassword)
    // Get password policy from Firebase
    const passwordPolicy = userPasswordStatus.passwordPolicy.customStrengthOptions
    // Check for empty fields and/or email failing validation
    if (
      (!userEmail || !EMAILPATTERN.test(userEmail)) &&
      !userPassword &&
      !userConfirmPassword
    ) {
      setPasswordError(bothPasswordFieldsRequired);
      setEmailError(emailErrorText);
    }
    // Check for missing password field
    if (
      (userPassword !== userConfirmPassword && !userPassword) ||
      !userConfirmPassword
    ) {
      setPasswordError(bothPasswordFieldsRequired);
      // Check password meets requirements
    } else if (!userPasswordStatus.isValid) {
      const text = displayPasswordPolicy(userPasswordStatus, passwordPolicy)
      setPasswordError(text);
      // Check for passwords matching
    } else if (userPassword !== userConfirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      // Passwords match, hide password error message
      setPasswordError("");
    }
    if (
      userEmail &&
      EMAILPATTERN.test(userEmail) &&
      userPassword &&
      userConfirmPassword &&
      userPassword === userConfirmPassword &&
      userPasswordStatus.isValid
    ) {
      try {
        // * Simulate login delay (not really necessary, just for experience)
        await new Promise(resolve => setTimeout(resolve, 2000));
        const newUserInfo = await signUpUser(userEmail, userPassword);
        setUser({ email: userEmail, uid: newUserInfo.uid });
        toast.success("Account was set up successfully!")
        navigate("/home");
      } catch (e) {
        toast.error(`${e}`);
        return;
      }
      // Reset state, input fields, and error messages
      setFormHasBeenSubmitted(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsLogin(true);
      setPasswordError("");
      setEmailError("");
    }
    setFormHasBeenSubmitted(true);
  };

  const handleLogIn = async formData => {
    const userEmail = formData.get("email").trim();
    const userPassword = formData.get("password").trim();
    // Check for empty fields
    if (!userEmail || !EMAILPATTERN.test(userEmail)) {
      setEmailError(emailErrorText);
    }
    // Check if password was provided
    if (!userPassword) {
      setPasswordError(passwordFieldIsRequired);
    }
    if (userPassword) {
      // Hide password error message if password provided
      setPasswordError("");
    }
    if (EMAILPATTERN.test(userEmail) && userPassword) {
      try {
        // * Simulate login delay (not really necessary, just for experience)
        await new Promise(resolve => setTimeout(resolve, 2000));
        const loggedInUserInfo = await logInUser(userEmail, userPassword);
        setUser({ email: userEmail, uid: loggedInUserInfo.uid });
        toast.success("Logged in successfully!")
        navigate("/home");
      } catch (e) {
        console.error(e);
        toast.error(
          "An error occurred while logging in. If you don't have an account, " +
          "please create one to continue."
        );
        return;
      }
      // Reset state, input fields, and error messages
      setFormHasBeenSubmitted(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsLogin(true);
      setPasswordError("");
      setEmailError("");
    } else {
      setFormHasBeenSubmitted(true);
    }
  };

  const handleSubmit = async formData => {
    if (isLogin) {
      await handleLogIn(formData);
    } else {
      await handleSignUp(formData);
    }
  };

  return (
    <AuthForm
      handleSubmit={handleSubmit}
      handleClick={handleClick}
      isLogin={isLogin}
      EMAILREGEXPATTERN={EMAILREGEXPATTERN}
      email={email}
      setEmail={setEmail}
      emailPattern={EMAILPATTERN}
      emailError={emailError}
      formHasBeenSubmitted={formHasBeenSubmitted}
      password={password}
      setPassword={setPassword}
      setPasswordError={setPasswordError}
      passwordError={passwordError}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      formRef={formRef}
    />
  );
}
