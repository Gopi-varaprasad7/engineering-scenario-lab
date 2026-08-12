type UserInput = {
  name: unknown;
  email: unknown;
  age: unknown;
  password: unknown;
};

type ValidationResult =
  | {
      valid: true;
      errors: {};
    }
  | {
      valid: false;
      errors: Record<string, string>;
    };

export const validateCreateUser = (input: UserInput): ValidationResult => {
  const errors: Record<string, string> = {};

  // Name
  if (typeof input.name !== 'string') {
    errors.name = 'Name must be a string';
  } else {
    const name = input.name.trim();

    if (!name) {
      errors.name = 'Name is required';
    } else if (name.length < 4) {
      errors.name = 'Name must be at least 4 characters';
    } else if (name.length > 25) {
      errors.name = 'Name must not exceed 25 characters';
    } else if (!/^[A-Za-z ]+$/.test(name)) {
      errors.name = 'Name can contain only letters and spaces';
    }
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof input.email !== 'string') {
    errors.email = 'Email must be a string';
  } else {
    const email = input.email.trim().toLowerCase();

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email format';
    } else if (!email.endsWith('@gmail.com')) {
      errors.email = 'Email must end with @gmail.com';
    }
  }

  // Age
  if (typeof input.age !== 'number') {
    errors.age = 'Age must be a number';
  } else if (!Number.isInteger(input.age)) {
    errors.age = 'Age must be an integer';
  } else if (input.age <= 0 || input.age > 100) {
    errors.age = 'Age must be between 1 and 100';
  }

  // Password
  if (typeof input.password !== 'string') {
    errors.password = 'Password must be a string';
  } else {
    const password = input.password;

    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain an uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      errors.password = 'Password must contain a lowercase letter';
    } else if (!/[0-9]/.test(password)) {
      errors.password = 'Password must contain a number';
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      errors.password = 'Password must contain a special character';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    errors: {},
  };
};
