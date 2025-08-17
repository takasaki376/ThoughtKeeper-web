export interface PasswordValidationResult {
  errors: string[];
  isValid: boolean;
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("パスワードは8文字以上である必要があります");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("小文字を含む必要があります");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("大文字を含む必要があります");
  }

  if (!/\d/.test(password)) {
    errors.push("数字を含む必要があります");
  }

  return {
    errors,
    isValid: errors.length === 0,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
