export function validateAuth(values, isRegister = false) {
  const errors = {};

  if (isRegister) {
    const username = (values.username || '').trim();
    if (!username) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (username.includes('@')) {
      errors.username = 'Username cannot be an email. Enter a nickname or handle without "@"';
    } else if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, underscores, or dots';
    }
  }

  const identifier = (values.email || values.username || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (isRegister) {
    if (!identifier) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(identifier)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com)';
    }
  } else {
    // Login supports both Email and Name / Username
    if (!identifier) {
      errors.email = 'Please enter your email address or your name';
    } else if (identifier.includes('@') && !emailRegex.test(identifier)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com)';
    } else if (!identifier.includes('@') && identifier.length < 2) {
      errors.email = 'Name or username must be at least 2 characters';
    }
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (isRegister && values.confirmPassword !== undefined) {
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
