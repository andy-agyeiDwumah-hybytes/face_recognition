export const EMAILREGEXPATTERN = "^[^@]+@[^@]+.[a-zA-Z]{2,}$";

export const MINLENGTHFORPASSWORD = 6;

export const EMAILPATTERN = new RegExp(EMAILREGEXPATTERN);

// Collection name to store all face data
export const FACEDATA = "face_data";

// Collection name to store all user information
export const USERS = "users"

// Stores Password requirement options from Firebase
// * Does not include 'Force upgrade on sign-in' option
// export const PASSWORDPOLICY = [
//     "minPasswordLength",
//     "maxPasswordLength",
//     "containsLowercaseLetter",
//     "containsUppercaseLetter",
//     "containsNumericCharacter",
//     "containsNonAlphanumericCharacter"
// ]