import { useState ,useEffect } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
 const { user, login } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/panel');
      } else {
        navigate('/'); 
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed! Please check credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition duration-200"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Are you a participant? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
      </p>
    </div>
  );
};

export default AdminLogin;