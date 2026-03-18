import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import api from '../services/api';

const FarmerDashboard = () => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const res = await api.get(`/transactions?farmer=${user._id}`);
        setTransactions(res.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTx();
    const interval = setInterval(fetchTx, 3000);
    return () => clearInterval(interval);
  }, [user._id]);

  const stats = {
    total: transactions.reduce((sum, t) => sum + (t.weightKg || 0), 0),
    earned: transactions.reduce((sum, t) => sum + (t.netAmount || 0), 0),
    commissionPaid: transactions.reduce((sum, t) => sum + (t.commissionAmount || 0), 0),
    pending: transactions.filter(t => t.status === 'PRICE_PENDING').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">👨‍🌾</div>
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-green-100">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button onClick={logout} className="bg-white/20 px-6 py-3 rounded-xl font-bold">{t.logout}</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center card-hover">
            <div className="text-gray-500 text-sm font-bold">{t.supply}</div>
            <div className="text-3xl font-black text-gray-800">
              {stats.total.toFixed(2)} <span className="text-base text-gray-400 font-normal">{t.kg}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center card-hover">
            <div className="text-gray-500 text-sm font-bold">{t.earned}</div>
            <div className="text-3xl font-black text-green-600">₹{stats.earned.toFixed(0)}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center card-hover">
            <div className="text-gray-500 text-sm font-bold">Commission Paid</div>
            <div className="text-3xl font-black text-red-500">₹{stats.commissionPaid.toFixed(0)}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center card-hover">
            <div className="text-gray-500 text-sm font-bold">{t.pending}</div>
            <div className="text-3xl font-black text-orange-500">{stats.pending}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">{t.supplyHistory}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.preferredChannel === 'WHATSAPP' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {user.preferredChannel === 'WHATSAPP' ? <><i className="fab fa-whatsapp mr-1"></i> WhatsApp</> : <><i className="fas fa-sms mr-1"></i> SMS</>}
            </span>
          </div>
          <div className="divide-y">
            {transactions.map(tx => (
              <div key={tx._id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {tx.transactionType === 'BUYER_TO_BUYER' && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-bold">Resale (5% Comm)</span>
                      )}
                      {tx.transactionType === 'FARMER_TO_BUYER' && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">Direct (No Comm)</span>
                      )}
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${tx.status === 'PRICE_APPLIED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {tx.status === 'PRICE_APPLIED' ? t.paid : t.pendingStatus}
                      </span>
                    </div>
                    <div className="font-bold text-lg text-gray-800">{tx.flowerName}</div>
                    <div className="text-sm text-gray-600">{t.via}: {tx.buyer?.fullName || 'Unknown'}</div>
                    <div className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-800">
                      {tx.weightKg} <span className="text-sm text-gray-500 font-normal">{t.kg}</span>
                    </div>
                    {tx.status === 'PRICE_APPLIED' ? (
                      <div className="mt-2 space-y-1">
                        <div className="text-sm text-gray-600">Gross: ₹{tx.grossAmount?.toFixed(2)}</div>
                        {tx.commissionAmount > 0 && (
                          <div className="text-sm text-red-600">Comm: -₹{tx.commissionAmount?.toFixed(2)}</div>
                        )}
                        <div className="text-lg font-bold text-green-600 border-t pt-1">Net: ₹{tx.netAmount?.toFixed(2)}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-orange-600 font-medium">{t.pendingStatus}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && <div className="p-12 text-center text-gray-400">{t.noSupplies}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;