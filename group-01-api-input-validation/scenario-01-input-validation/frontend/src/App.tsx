import { FormEvent, useState } from 'react';
import { validateUserForm } from './validator/user.validator';

// Define user type if using TypeScript
interface User {
  id: string | number;
  name: string;
  email: string;
  age: number;
}

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      if(Object.keys(validateError).length > 0){
        setErrors(validateError);
        return;
      }

    try {
      
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          age: Number(form.age),
          password: form.password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setErrors(data.errors || {});
        } else {
          setMessage(data.message || 'Something went wrong');
        }

        return;
      }

      setMessage('User created successfully');

      setForm({
        name: '',
        email: '',
        age: '',
        password: '',
      });
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
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

        <button type='submit'>Create User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
