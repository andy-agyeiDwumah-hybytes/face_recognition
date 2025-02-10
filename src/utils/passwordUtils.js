export const displayPasswordPolicy = (userPasswordStatus, passwordPolicy) => {
    let text = "Password must meet the following requirements:\n\n";
    if (!userPasswordStatus.containsLowercaseLetter) {
      text += "Contains lower case letter\n";
    }
    if (!userPasswordStatus.containsNonAlphanumericCharacter) {
      text += "Contains non alphanumeric character\n";
    }
    if (!userPasswordStatus.containsNumericCharacter) {
      text += "Contains numeric character\n";
    }
    if (!userPasswordStatus.containsUppercaseLetter) {
      text += "Contains uppercase character\n";
    }
    if (!userPasswordStatus.meetsMinPasswordLength) {
      text += `Meets minimum password length: ${passwordPolicy.minPasswordLength}`;
    }
    return text
}