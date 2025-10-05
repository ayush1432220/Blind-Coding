import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Page load par check karne ke liye
    const navigate = useNavigate();
    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const { data } = await axiosInstance.get('/api/auth/me');
                setUser(data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserStatus();
    }, []);

  const registerAndLogin = async (name, email, password) => {
        const { data } = await axiosInstance.post('/api/auth/register', { name, email, password });
        setUser(data); 
        navigate('/');
    };
    // Login function
    const login = async (email, password) => {
        console.log(`Login Auth is called`);
        const { data } = await axiosInstance.post('/api/auth/login', { email, password });
        console.log(data);
        setUser(data);
        if (data.role === 'admin') {
            navigate('/admin/panel');
        } else {
            navigate('/');
        }
    };

    const logout = async () => {
        await axiosInstance.post('/api/auth/logout');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading,registerAndLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};