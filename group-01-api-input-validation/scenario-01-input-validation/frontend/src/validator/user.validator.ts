type UserForm = {
  name: string;
  email: string;
  age: string;
  password: string;
};

export const validateUserForm = (form: UserForm) => {
  const errors: Record<string, string> = {};

  const name = form.name.trim();
  const email = form.email.trim().toLowerCase();
  const age = Number(form.age);
  const password = form.password;

  // Name
  if (!name) {
    errors.name = "Name is required";
  } else if (name.length < 4) {
    errors.name = "Name must be at least 4 characters";
  } else if (name.length > 25) {
    errors.name = "Name must not exceed 25 characters";
  } else if (!/^[A-Za-z ]+$/.test(name)) {
    errors.name = "Name can contain only letters and spaces";
  }

  // Email
  if (!email) {
    errors.email = "Email is required";
  } else if (!email.endsWith("@gmail.com")) {
    errors.email = "Email must end with @gmail.com";
  }

  // Age
  if (!form.age) {
    errors.age = "Age is required";
  } else if (!Number.isInteger(age)) {
    errors.age = "Age must be a number";
  } else if (age <= 0 || age > 100) {
    errors.age = "Age must be between 1 and 100";
  }

  // Password
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must contain an uppercase letter";
  } else if (!/[a-z]/.test(password)) {
    errors.password = "Password must contain a lowercase letter";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "Password must contain a number";
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    errors.password = "Password must contain a special character";
  }

  return errors;
};