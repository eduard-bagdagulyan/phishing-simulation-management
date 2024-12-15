import { useState, FormEvent } from 'react';
import { login } from '../api/auth';
import { setAuthToken } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    try {
      const data = await login(username, password);
      localStorage.setItem('access_token', data.access_token);
      setAuthToken(data.access_token);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response) {
        const message = Array.isArray(err.response.data?.message)
          ? err.response.data?.message.join(', ')
          : err.response.data?.message || 'Login failed';
        setErrorMsg(message);
      } else {
        setErrorMsg('Login failed due to an unknown error.');
      }
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h1 className="mb-4">Login</h1>
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          Login
        </button>
      </form>
      <p className="text-center mt-3">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
