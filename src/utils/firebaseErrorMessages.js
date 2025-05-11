// utils/firebaseErrorMessages.js
export const getAuthErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-not-found':
        return 'No user found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please try again.';
      case 'auth/email-already-in-use':
        return 'Email is already registered.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };
  