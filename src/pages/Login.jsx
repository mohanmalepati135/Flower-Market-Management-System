


import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import Toast from '../components/Toast';

const Login = () => {
  const { t } = useLanguage();
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (!result.success) {
      setToast({ 
        message: result.message || t.invalidCredentials, 
        type: 'error' 
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl">
            <i className="fas fa-leaf"></i>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">{t.appName}</h1>
        </div>
        
        <div className="flex justify-center mb-6">
          <LanguageSelector darkMode={true} />
        </div>

        {/* Show connection error if any */}
        {authError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder={t.email} 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500" 
            required 
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder={t.password} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500" 
            required 
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <><i className="fas fa-spinner fa-spin mr-2"></i>Loading...</>
            ) : (
              t.login
            )}
          </button>
        </form>
        
        {/* <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
          <div className="font-bold mb-2">Demo Accounts:</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Admin:</span>
              <span className="font-mono">admin@market.com / admin123</span>
            </div>
            <div className="flex justify-between">
              <span>Buyer:</span>
              <span className="font-mono">rajesh@trader.com / buyer123</span>
            </div>
            <div className="flex justify-between">
              <span>Farmer:</span>
              <span className="font-mono">ram@farm.com / farmer123</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Login;