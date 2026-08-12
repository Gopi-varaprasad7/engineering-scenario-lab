import { FormEvent, useState } from 'react';
import { validateUserForm } from './validator/user.validator';
import { createUser } from './api/users';

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setMessage('');
    setErrors({});

    const validateError = validateUserForm(form);
    if (Object.keys(validateError).length > 0) {
      setErrors(validateError);
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await createUser({
        name: form.name,
        email: form.email,
        age: Number(form.age),
        password: form.password,
      });

      setMessage(data.message);

      setForm({
        name: '',
        email: '',
        age: '',
        password: '',
      });
    } catch (error) {
      console.error(error);

      if (typeof error === 'object' && error !== null && 'status' in error) {
        const apiError = error as {
          status: number;
          data: {
            message?: string;
            errors?: Record<string, string>;
          };
        };

        if (apiError.status === 400) {
          setErrors(apiError.data.errors || {});
        } else {
          setMessage(apiError.data.message || 'Something went wrong');
        }
      } else {
        setMessage('Unable to connect to server');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <input
          name='name'
          placeholder='Name'
          value={form.name}
          onChange={handleChange}
        />

        {errors.name && <p>{errors.name}</p>}
        <input
          name='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
        />

        {errors.email && <p>{errors.email}</p>}

        <input
          name='age'
          type='number'
          placeholder='Age'
          value={form.age}
          onChange={handleChange}
        />

        {errors.age && <p>{errors.age}</p>}

        <input
          name='password'
          type='password'
          placeholder='Password'
          value={form.password}
          onChange={handleChange}
        />

        {errors.password && <p>{errors.password}</p>}

        <button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Creating..' : 'Create User'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
