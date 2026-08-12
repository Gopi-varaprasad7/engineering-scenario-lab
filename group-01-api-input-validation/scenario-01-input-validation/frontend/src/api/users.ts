export type CreateUserInput = {
  name: string;
  email: string;
  age: number;
  password: string;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    age: number;
    created_at: string;
    updated_at: string;
  };
};

export const createUser = async (
  user: CreateUserInput,
): Promise<CreateUserResponse> => {
  const response = await fetch('http://localhost:5001/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }
  return data;
};
