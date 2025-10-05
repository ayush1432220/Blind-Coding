// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          BlindCode
        </Link>
        <div>
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-800 px-3">Login</Link>
              <Link to="/register" className="text-gray-600 hover:text-gray-800 px-3">Register</Link>
            </>
          ) : (
            <div className="flex items-center">
              {user.role === 'admin' && <Link to="/admin/panel" className="text-gray-600 mr-4">Admin Panel</Link>}
              <span className="text-gray-800 mr-4">Welcome, {user.name}</span>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;