import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  
  const colors = { 
    success: 'bg-green-500', 
    error: 'bg-red-500', 
    info: 'bg-blue-500' 
  };
  
  const titles = {
    success: 'Success!',
    error: 'Error!',
    info: 'Info'
  };
  
  return (
    <div className={`fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-xl shadow-2xl z-50 slide-up`}>
      <div className="font-bold">{titles[type]}</div>
      <div className="text-sm">{message}</div>
    </div>
  );
};

export default Toast;