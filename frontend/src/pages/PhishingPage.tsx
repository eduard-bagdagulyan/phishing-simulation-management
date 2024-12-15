import { useEffect, useState, FormEvent } from 'react';
import { getAttempts, sendAttempt } from '../api/attempts';
import { setAuthToken } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import { Attempt } from '../types';

export default function PhishingPage() {
  const [email, setEmail] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthToken(token);
    loadAttempts();
  }, [navigate]);

  async function loadAttempts() {
    try {
      const data = await getAttempts();
      setAttempts(data);
    } catch (err) {
      console.error(err);
      alert('Could not load attempts. Please log in again.');
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await sendAttempt(email);
      setEmail('');
      setSuccessMsg('Phishing email sent successfully!');
      loadAttempts();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send attempt');
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('access_token');
    setAuthToken(null);
    navigate('/login');
  }

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Phishing Simulation</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSend} className="mb-4">
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <div className="d-flex align-items-center">
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Sending...
              </div>
            ) : (
              'Send Phishing Email'
            )}
          </button>
        </div>
      </form>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <h2 className="mb-3">All Attempts</h2>
      <table className="table table-striped table-hover">
        <thead className="table-light">
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a) => (
            <tr key={a._id}>
              <td>{a.email}</td>
              <td>{a.status}</td>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
