export const checkPasswordStrength = (password) => {
    // Regex: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    
    if (!passwordRegex.test(password)) {
      return {
        isValid: false,
        error: 'Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'
      };
    }
    
    return { isValid: true, error: '' };
  };