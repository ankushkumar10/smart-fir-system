import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // This will be replaced with actual API call
      // Simulating API call for now
      const userData = {
        id: '123',
        name: 'Test User',
        email: email,
        role: email.includes('police') ? 'police' : 'citizen',
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // This will be replaced with actual API call
      // Simulating API call for now
      const newUser = {
        id: '123',
        name: userData.name,
        email: userData.email,
        role: userData.role || 'citizen',
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setLoading(false);
      return newUser;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};