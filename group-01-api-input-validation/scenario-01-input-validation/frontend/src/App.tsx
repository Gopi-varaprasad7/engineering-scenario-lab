import { useEffect, useState } from 'react';

type HealthResponse = {
  success: boolean;
  message: string;
};

function App() {
  const [message, setMessage] = useState('Checking backend...');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/health');
        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        const data: HealthResponse = await response.json();
        setMessage(data.message);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'something went wrong';
        setError(errorMessage);
      }
    };

    fetchHealth();
  }, []);
  return (
    <div>
      <h1>Scenario 01 - Input Validation</h1>

      <p>{message}</p>

      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
