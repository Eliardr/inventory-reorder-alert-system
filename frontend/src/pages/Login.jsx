import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await axiosInstance.post('/api/auth/login', formData);

      // Be flexible about backend response shape
      const data = res?.data ?? {};
      console.log('login response:', data);

      // Try common token locations
      const token =
        data.token ??
        data.accessToken ??
        data.access_token ??
        (res?.headers?.authorization
          ? res.headers.authorization.replace(/^Bearer\s+/i, '')
          : null);

      if (!token) {
        alert('Server did not return a token. Please check backend login response.');
        return;
      }

      // 1) Save token so axios interceptor can attach it
      localStorage.setItem('token', token);
      console.log('token saved to localStorage');

      // 2) Put a user object in context (IMPORTANT: wrap as { user } to match AuthContext)
      const user = data.user ?? data.data?.user ?? { email: formData.email };
      login({ user });                         // ⬅️ changed from login(user) to login({ user })

      // 3) Go to dashboard
      navigate('/inventory');
    } catch (error) {
      console.error('Login failed:', error?.response?.data || error.message);
      alert(error?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          autoComplete="email"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}

