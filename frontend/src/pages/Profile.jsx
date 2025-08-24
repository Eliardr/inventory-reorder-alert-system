// frontend/src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

export default function Profile() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', university: '', address: '' });
  const [busy, setBusy] = useState(false);

  // Prefill from context; if direct refresh (no user yet), fetch /me
  useEffect(() => {
    if (loading) return;

    async function pullMe() {
      try {
        const res = await axiosInstance.get('/api/auth/me');
        const u = res.data?.user || {};
        setForm({
          name: u.name || '',
          email: u.email || '',
          university: u.university || '',
          address: u.address || '',
        });
      } catch {
        alert('Failed to fetch profile. Please try again.');
      }
    }

    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        university: user.university || '',
        address: user.address || '',
      });
    } else {
      pullMe();
    }
  }, [user, loading]);

  const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setBusy(true);
      const res = await axiosInstance.put('/api/auth/me', {
        name: form.name,
        university: form.university,
        address: form.address,
      });
      const u = res.data?.user || {};
      setForm({
        name: u.name || '',
        email: u.email || '',
        university: u.university || '',
        address: u.address || '',
      });
      alert('Profile updated!');
    } catch {
      alert('Failed to update profile.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading…</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow">
      <h2 className="text-3xl font-bold text-center mb-6">Your Profile</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-sm font-medium mb-1">Name</span>
          <input className="w-full p-3 border rounded" value={form.name} onChange={onChange('name')} />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Email (read-only)</span>
          <input className="w-full p-3 border rounded bg-gray-100" value={form.email} readOnly />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">University</span>
          <input className="w-full p-3 border rounded" value={form.university} onChange={onChange('university')} />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">Address</span>
          <input className="w-full p-3 border rounded" value={form.address} onChange={onChange('address')} />
        </label>

        <button disabled={busy} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded">
          {busy ? 'Saving…' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
