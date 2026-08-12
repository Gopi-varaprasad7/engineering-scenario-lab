import { useEffect, useState } from 'react';

// Define user type if using TypeScript
interface User {
  id: string | number;
  name: string;
  email: string;
  age: number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users');
        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        const data = await response.json();
        setUsers(data.data)
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Something went wrong';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      {users.map((user) => (
        // Added key prop here
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>Age: {user.age}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
