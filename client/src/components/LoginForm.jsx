import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (status === 'failed') {
      setPassword('');
    }
  }, [status]);

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError('Invalid email format.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: 400 }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              autoComplete="username"
              required
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'loading'}
              autoComplete="current-password"
              required
            />
          </div>

          {formError && (
            <div className="alert alert-warning py-2">{formError}</div>
          )}

          {status === 'failed' && error && (
            <div className="alert alert-danger py-2">
              {error?.error || error || 'Login failed'}
            </div>
          )}

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
