import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

type CreateUserDto = {
  email: string;
  password: string;
  name: string;
};

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (userData: CreateUserDto) => {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Error creating user');
      }
      return response.json();
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error: Error) => {
      console.error('Error creating user:', error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password, name });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        {mutation.isError && (
          <p>Error creating user: {mutation.error.message}</p>
        )}
        {mutation.isSuccess && <p>User created successfully!</p>}
      </form>
    </div>
  );
};

export default Signup;
