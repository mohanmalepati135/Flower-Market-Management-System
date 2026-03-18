// import React, { useState, useEffect } from 'react';
// import { useLanguage } from '../contexts/LanguageContext';
// import { useAuth } from '../contexts/AuthContext';
// import LanguageSelector from '../components/LanguageSelector';
// import Toast from '../components/Toast';
// import api from '../services/api';

// const AdminDashboard = () => {
//   const { t, lang } = useLanguage();
//   const { logout, user } = useAuth();
//   const [activeTab, setActiveTab] = useState('farmers');
//   const [users, setUsers] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [stats, setStats] = useState({});
//   const [toast, setToast] = useState(null);
//   const [flowers, setFlowers] = useState([]);
//   const [editingFlower, setEditingFlower] = useState(null);
//   const [newFlowerName, setNewFlowerName] = useState('');
//   const [newFlowerPrice, setNewFlowerPrice] = useState('');

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(fetchData, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [usersRes, txRes, statsRes, flowersRes] = await Promise.all([
//         api.get('/users'),
//         api.get('/transactions'),
//         api.get('/transactions/stats/overview'),
//         api.get('/flowers')
//       ]);
//       setUsers(usersRes.data);
//       setTransactions(txRes.data);
//       setStats(statsRes.data);
//       setFlowers(flowersRes.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleFixPrices = async (farmerId) => {
//     try {
//       const res = await api.post(`/transactions/fix-prices/${farmerId}`);
//       setToast({ message: `${res.data.fixed} prices fixed`, type: 'success' });
//       fetchData();
//     } catch (error) {
//       setToast({ message: error.response?.data?.message || 'Error fixing prices', type: 'error' });
//     }
//   };

//   const handleToggleUser = async (id) => {
//     try {
//       await api.patch(`/users/${id}/toggle-status`);
//       fetchData();
//     } catch (error) {
//       setToast({ message: 'Error toggling user status', type: 'error' });
//     }
//   };

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     try {
//       await api.post('/users', {
//         email: form.email.value,
//         password: form.password.value,
//         fullName: form.fullName.value,
//         phone: form.phone.value,
//         role: form.role.value,
//         preferredChannel: form.channel.value
//       });
//       setToast({ message: 'User created', type: 'success' });
//       form.reset();
//       fetchData();
//     } catch (error) {
//       setToast({ message: error.response?.data?.message || 'Error creating user', type: 'error' });
//     }
//   };

//   const handleUpdateFlower = async (id, newPrice) => {
//     try {
//       await api.patch(`/flowers/${id}`, { basePrice: parseFloat(newPrice) });
//       setEditingFlower(null);
//       setToast({ message: 'Price updated', type: 'success' });
//       fetchData();
//     } catch (error) {
//       setToast({ message: 'Error updating price', type: 'error' });
//     }
//   };

//   const handleAddFlower = async (e) => {
//     e.preventDefault();
//     if (!newFlowerName || !newFlowerPrice) return;
//     try {
//       await api.post('/flowers', {
//         name: newFlowerName,
//         basePrice: parseFloat(newFlowerPrice)
//       });
//       setNewFlowerName('');
//       setNewFlowerPrice('');
//       setToast({ message: 'New flower added', type: 'success' });
//       fetchData();
//     } catch (error) {
//       setToast({ message: error.response?.data?.message || 'Error adding flower', type: 'error' });
//     }
//   };

//   const handleDeleteFlower = async (id) => {
//     if (window.confirm(t.deleteConfirm)) {
//       try {
//         await api.delete(`/flowers/${id}`);
//         setToast({ message: 'Flower deleted', type: 'success' });
//         fetchData();
//       } catch (error) {
//         setToast({ message: 'Error deleting flower', type: 'error' });
//       }
//     }
//   };

//   const handleApplyPrice = async (flowerName) => {
//     const price = prompt("Enter market price");
//     if (price) {
//       try {
//         await api.post('/flowers/apply-price', {
//           flowerName,
//           price: parseFloat(price)
//         });
//         setToast({ message: 'Price applied to pending transactions', type: 'success' });
//         fetchData();
//       } catch (error) {
//         setToast({ message: 'Error applying price', type: 'error' });
//       }
//     }
//   };

//   const handleSettlement = async (farmerId, farmerName) => {
//     try {
//       const res = await api.get(`/transactions/settlement/${farmerId}`);
//       const settlement = res.data;
//       alert(
//         `Settlement Summary\n\n` +
//         `Farmer: ${farmerName}\n\n` +
//         `Total Weight: ${settlement.totalWeight.toFixed(2)} kg\n` +
//         `Gross: ₹${settlement.gross.toFixed(2)}\n` +
//         `Commission: ₹${settlement.commission.toFixed(2)}\n` +
//         `Net Payable: ₹${settlement.net.toFixed(2)}`
//       );
//     } catch (error) {
//       setToast({ message: 'Error fetching settlement', type: 'error' });
//     }
//   };

//   const farmers = users.filter(u => u.role === 'FARMER');

//   const getFarmerTransactions = (farmerId) => {
//     return transactions.filter(t => t.farmer._id === farmerId && !t.isDeleted);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
//       <header className="bg-white shadow-sm border-b sticky top-0 z-40 p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
//               <i className="fas fa-leaf"></i>
//             </div>
//             <h1 className="text-xl font-bold">{t.adminCenter}</h1>
//           </div>
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-gray-500">{user.email}</span>
//             <LanguageSelector />
//             <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600">
//               <i className="fas fa-sign-out-alt text-xl"></i>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-indigo-500">
//             <div className="text-sm text-gray-500">{t.farmers}</div>
//             <div className="text-2xl font-black">{stats.farmerCount || 0}</div>
//           </div>
//           <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-500">
//             <div className="text-sm text-gray-500">{t.pending}</div>
//             <div className="text-2xl font-black text-orange-600">{stats.pendingCount || 0}</div>
//           </div>
//           <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500">
//             <div className="text-sm text-gray-500">{t.revenue}</div>
//             <div className="text-2xl font-black text-green-600">₹{(stats.totalRevenue || 0).toFixed(0)}</div>
//           </div>
//           <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500">
//             <div className="text-sm text-gray-500">{t.volume}</div>
//             <div className="text-2xl font-black text-blue-600">{(stats.totalWeight || 0).toFixed(1)} {t.kg}</div>
//           </div>
//         </div>

//         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//           <button 
//             onClick={() => setActiveTab('farmers')} 
//             className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'farmers' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
//           >
//             {t.farmerWise}
//           </button>
//           <button 
//             onClick={() => setActiveTab('flowers')} 
//             className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'flowers' ? 'bg-pink-600 text-white' : 'bg-white border'}`}
//           >
//             <i className="fas fa-seedling mr-2"></i>{t.manageFlowers}
//           </button>
//           <button 
//             onClick={() => setActiveTab('add')} 
//             className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'add' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
//           >
//             {t.addUser}
//           </button>
//           <button 
//             onClick={() => setActiveTab('users')} 
//             className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
//           >
//             {t.manageUsers}
//           </button>
//         </div>

//         {activeTab === 'farmers' && (
//           <div className="space-y-4">
//             {farmers.map(farmer => {
//               const farmerTx = getFarmerTransactions(farmer._id);
//               const pending = farmerTx.filter(t => t.status === 'PRICE_PENDING').length;
//               const totalWeight = farmerTx.reduce((sum, t) => sum + t.weightKg, 0);
//               const totalNet = farmerTx.reduce((sum, t) => sum + (t.netAmount || 0), 0);
//               const totalCommission = farmerTx.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
              
//               return (
//                 <div key={farmer._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 card-hover">
//                   <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center gap-3">
//                         <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
//                           {farmer.fullName[0]}
//                         </div>
//                         <div>
//                           <h3 className="font-bold text-lg">{farmer.fullName}</h3>
//                           <p className="text-indigo-100 text-sm flex items-center gap-2">
//                             {farmer.phone} • {farmerTx.length} txns
//                             <span className={`text-xs px-2 py-0.5 rounded-full ${farmer.preferredChannel === 'WHATSAPP' ? 'bg-green-500/30' : 'bg-blue-500/30'}`}>
//                               {farmer.preferredChannel}
//                             </span>
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-2xl font-black">{totalWeight.toFixed(2)} {t.kg}</div>
//                         {totalNet > 0 && (
//                           <div className="text-xs text-indigo-100">
//                             Net: ₹{totalNet.toFixed(0)} {totalCommission > 0 && `(Comm: ₹${totalCommission.toFixed(0)})`}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="p-4">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-4 py-2 text-left">{t.time}</th>
//                           <th className="px-4 py-2 text-left">{t.flower}</th>
//                           <th className="px-4 py-2 text-right">{t.weight}</th>
//                           <th className="px-4 py-2 text-center">{t.buyer}</th>
//                           <th className="px-4 py-2 text-right">{t.net}</th>
//                           <th className="px-4 py-2 text-center">{t.status}</th>
//                           <th className="px-4 py-2 text-center">{t.transactionType}</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {farmerTx.slice(0, 5).map(tx => (
//                           <tr key={tx._id} className="border-b">
//                             <td className="px-4 py-2 text-gray-600">{new Date(tx.createdAt).toLocaleTimeString()}</td>
//                             <td className="px-4 py-2">{tx.flowerName}</td>
//                             <td className="px-4 py-2 text-right font-mono">{tx.weightKg} {t.kg}</td>
//                             <td className="px-4 py-2">{tx.buyerName}</td>
//                             <td className="px-4 py-2 text-right text-green-600">₹{tx.netAmount?.toFixed(2) || '-'}</td>
//                             <td className="px-4 py-2 text-center">
//                               <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'PRICE_APPLIED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
//                                 {tx.status === 'PRICE_APPLIED' ? t.paid : t.pendingStatus}
//                               </span>
//                             </td>
//                             <td className="px-4 py-2 text-center">
//                               <span className={`px-2 py-1 rounded text-xs ${tx.transactionType === 'BUYER_TO_BUYER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
//                                 {tx.transactionType === 'BUYER_TO_BUYER' ? 'Resale' : 'Direct'}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
                    
//                     <div className="mt-4 flex justify-between items-center">
//                       <span className="text-sm text-gray-600">{farmerTx.length} transactions</span>
//                       <div className="flex gap-2">
//                         {pending > 0 && (
//                           <button 
//                             onClick={() => handleFixPrices(farmer._id)} 
//                             className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm"
//                           >
//                             {t.fixPrices} ({pending})
//                           </button>
//                         )}
//                         <button
//                           onClick={() => handleSettlement(farmer._id, farmer.fullName)}
//                           className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm"
//                         >
//                           {t.settlement}
//                         </button>
//                         <button 
//                           onClick={() => {
//                             const msg = `Settlement: Total ₹${totalNet.toFixed(2)}, Weight ${totalWeight.toFixed(2)}kg${totalCommission > 0 ? `, Commission: ₹${totalCommission.toFixed(2)}` : ''}`;
//                             window.open(`https://wa.me/${farmer.phone}?text=${encodeURIComponent(msg)}`, '_blank');
//                           }} 
//                           className="whatsapp-btn text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
//                         >
//                           <i className="fab fa-whatsapp"></i> {t.sendStatement}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {activeTab === 'flowers' && (
//           <div className="space-y-6">
//             <div className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-pink-500">
//               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <i className="fas fa-plus-circle text-pink-600"></i> {t.addNewFlower}
//               </h3>
//               <form onSubmit={handleAddFlower} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <input 
//                   type="text" 
//                   placeholder={t.flowerName} 
//                   value={newFlowerName}
//                   onChange={(e) => setNewFlowerName(e.target.value)}
//                   className="p-4 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
//                   required 
//                 />
//                 <input 
//                   type="number" 
//                   placeholder={t.basePrice} 
//                   value={newFlowerPrice}
//                   onChange={(e) => setNewFlowerPrice(e.target.value)}
//                   className="p-4 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
//                   required 
//                   min="1"
//                   step="0.01"
//                 />
//                 <button type="submit" className="bg-pink-600 text-white font-bold py-4 rounded-xl hover:bg-pink-700 transition-colors">
//                   <i className="fas fa-plus mr-2"></i> {t.addNewFlower}
//                 </button>
//               </form>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//               <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-b">
//                 <h3 className="text-xl font-bold text-gray-800">{t.flowerManagement}</h3>
//                 <p className="text-sm text-gray-600 mt-1">Edit prices or remove flowers from the system</p>
//               </div>
//               <div className="divide-y">
//                 {flowers.map((flower) => (
//                   <div key={flower._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
//                         {flower.name[0]}
//                       </div>
//                       <div>
//                         <h4 className="font-bold text-lg text-gray-800">{flower.name}</h4>
//                         <p className="text-sm text-gray-500">ID: {flower._id}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-4">
//                       {editingFlower === flower._id ? (
//                         <div className="flex items-center gap-2">
//                           <input 
//                             type="number" 
//                             defaultValue={flower.basePrice}
//                             id={`price-${flower._id}`}
//                             className="w-32 p-2 border-2 border-indigo-500 rounded-lg text-right font-bold"
//                             step="0.01"
//                             min="0"
//                           />
//                           <button 
//                             onClick={() => handleUpdateFlower(flower._id, document.getElementById(`price-${flower._id}`).value)}
//                             className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                           >
//                             <i className="fas fa-check"></i>
//                           </button>
//                           <button 
//                             onClick={() => setEditingFlower(null)}
//                             className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
//                           >
//                             <i className="fas fa-times"></i>
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-4">
//                           <div className="text-right">
//                             <div className="text-2xl font-black text-indigo-600">₹{flower.basePrice}</div>
//                             <button
//                               onClick={() => handleApplyPrice(flower.name)}
//                               className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-bold"
//                             >
//                               Apply Price
//                             </button>
//                             <div className="text-xs text-gray-500">{t.pricePerKg}</div>
//                           </div>
//                           <div className="flex gap-2">
//                             <button 
//                               onClick={() => setEditingFlower(flower._id)}
//                               className="p-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors"
//                               title={t.edit}
//                             >
//                               <i className="fas fa-edit"></i>
//                             </button>
//                             <button 
//                               onClick={() => handleDeleteFlower(flower._id)}
//                               className="p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
//                               title={t.delete}
//                             >
//                               <i className="fas fa-trash"></i>
//                             </button>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 {flowers.length === 0 && (
//                   <div className="p-12 text-center text-gray-400">
//                     <i className="fas fa-seedling text-4xl mb-2"></i>
//                     <p>No flowers in database</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === 'add' && (
//           <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl">
//             <h3 className="text-xl font-bold mb-4">{t.createAccount}</h3>
//             <form onSubmit={handleCreateUser} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <select name="role" className="w-full p-4 border rounded-xl" required>
//                   <option value="FARMER">{t.farmer}</option>
//                   <option value="BUYER">{t.buyer}</option>
//                 </select>
//                 <select name="channel" className="w-full p-4 border rounded-xl" required>
//                   <option value="WHATSAPP">WhatsApp</option>
//                   {/* <option value="SMS">SMS</option> */}
//                 </select>
//               </div>
//               <input name="fullName" placeholder={t.fullName} className="w-full p-4 border rounded-xl" required />
//               <input name="email" type="email" placeholder={t.email} className="w-full p-4 border rounded-xl" required />
//               <input name="phone" placeholder={t.phone} className="w-full p-4 border rounded-xl" required />
//               <input name="password" type="password" placeholder={t.passwordOptional} className="w-full p-4 border rounded-xl" />
//               <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">{t.createBtn}</button>
//             </form>
//           </div>
//         )}

//         {activeTab === 'users' && (
//           <div className="bg-white rounded-2xl p-6 shadow-lg">
//             <h3 className="text-xl font-bold mb-4">{t.manageUsers}</h3>
//             <div className="space-y-2">
//               {users.map(u => (
//                 <div key={u._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
//                   <div className="flex items-center gap-3">
//                     <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${u.role === 'ADMIN' ? 'bg-purple-500' : u.role === 'BUYER' ? 'bg-blue-500' : 'bg-green-500'}`}>
//                       {u.fullName[0]}
//                     </div>
//                     <div>
//                       <div className="font-bold">
//                         {u.fullName} 
//                         <span className="text-xs text-gray-400 px-2 py-1 bg-gray-200 rounded-full ml-2">{u.preferredChannel}</span>
//                       </div>
//                       <div className="text-xs text-gray-500">{u.role} • {u.email}</div>
//                     </div>
//                   </div>
//                   {u.role !== 'ADMIN' && (
//                     <button 
//                       onClick={() => handleToggleUser(u._id)} 
//                       className={`px-4 py-2 rounded-lg text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
//                     >
//                       {u.status === 'ACTIVE' ? t.active : t.inactive}
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import Toast from '../components/Toast';
import api from '../services/api';

const AdminDashboard = () => {
  const { t, lang } = useLanguage();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('farmers');
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [toast, setToast] = useState(null);
  const [flowers, setFlowers] = useState([]);
  const [editingFlower, setEditingFlower] = useState(null);
  const [newFlowerName, setNewFlowerName] = useState('');
  const [newFlowerPrice, setNewFlowerPrice] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, txRes, statsRes, flowersRes] = await Promise.all([
        api.get('/users'),
        api.get('/transactions'),
        api.get('/transactions/stats/overview'),
        api.get('/flowers')
      ]);
      setUsers(usersRes.data);
      setTransactions(txRes.data);
      setStats(statsRes.data);
      setFlowers(flowersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFixPrices = async (farmerId) => {
    try {
      const res = await api.post(`/transactions/fix-prices/${farmerId}`);
      setToast({ message: `${res.data.fixed} prices fixed`, type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Error fixing prices', type: 'error' });
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle-status`);
      fetchData();
    } catch (error) {
      setToast({ message: 'Error toggling user status', type: 'error' });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await api.post('/users', {
        email: form.email.value,
        password: form.password.value,
        fullName: form.fullName.value,
        phone: form.phone.value,
        role: form.role.value,
        preferredChannel: form.channel.value
      });
      setToast({ message: 'User created', type: 'success' });
      form.reset();
      fetchData();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Error creating user', type: 'error' });
    }
  };

  const handleUpdateFlower = async (id, newPrice) => {
    try {
      await api.patch(`/flowers/${id}`, { basePrice: parseFloat(newPrice) });
      setEditingFlower(null);
      setToast({ message: 'Price updated', type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ message: 'Error updating price', type: 'error' });
    }
  };

  const handleAddFlower = async (e) => {
    e.preventDefault();
    if (!newFlowerName || !newFlowerPrice) return;
    try {
      await api.post('/flowers', {
        name: newFlowerName,
        basePrice: parseFloat(newFlowerPrice)
      });
      setNewFlowerName('');
      setNewFlowerPrice('');
      setToast({ message: 'New flower added', type: 'success' });
      fetchData();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Error adding flower', type: 'error' });
    }
  };

  const handleDeleteFlower = async (id) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await api.delete(`/flowers/${id}`);
        setToast({ message: 'Flower deleted', type: 'success' });
        fetchData();
      } catch (error) {
        setToast({ message: 'Error deleting flower', type: 'error' });
      }
    }
  };

  const handleApplyPrice = async (flowerName) => {
    const price = prompt("Enter market price");
    if (price) {
      try {
        await api.post('/flowers/apply-price', {
          flowerName,
          price: parseFloat(price)
        });
        setToast({ message: 'Price applied to pending transactions', type: 'success' });
        fetchData();
      } catch (error) {
        setToast({ message: 'Error applying price', type: 'error' });
      }
    }
  };

  const handleSettlement = async (farmerId, farmerName) => {
    try {
      const res = await api.get(`/transactions/settlement/${farmerId}`);
      const settlement = res.data;
      alert(
        `Settlement Summary\n\n` +
        `Farmer: ${farmerName}\n\n` +
        `Total Weight: ${settlement.totalWeight.toFixed(2)} kg\n` +
        `Gross: ₹${settlement.gross.toFixed(2)}\n` +
        `Commission: ₹${settlement.commission.toFixed(2)}\n` +
        `Net Payable: ₹${settlement.net.toFixed(2)}`
      );
    } catch (error) {
      setToast({ message: 'Error fetching settlement', type: 'error' });
    }
  };

  const farmers = users.filter(u => u.role === 'FARMER');

  const getFarmerTransactions = (farmerId) => {
    return transactions.filter(t => t.farmer._id === farmerId && !t.isDeleted);
  };

  // Helper to get buyer display with both names for resale
  const getBuyerDisplay = (tx) => {
    const buyerName = tx.buyer?.fullName || 'Unknown';
    
    if (tx.transactionType === 'BUYER_TO_BUYER' && tx.sellerBuyer) {
      const sellerName = tx.sellerBuyer?.fullName || 'Unknown';
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-purple-700 text-sm">{buyerName}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-400">←</span>
            <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{sellerName}</span>
            <span className="text-gray-400">(Seller)</span>
          </div>
        </div>
      );
    }
    
    return <span className="font-bold text-blue-700 text-sm">{buyerName}</span>;
  };

  // Calculate commission for display
  const getCommissionDisplay = (tx) => {
    if (tx.transactionType === 'BUYER_TO_BUYER' && tx.commissionAmount > 0) {
      return (
        <div className="flex flex-col items-end">
          <span className="text-green-600 font-semibold">₹{tx.netAmount?.toFixed(2)}</span>
          <span className="text-xs text-red-500">-₹{tx.commissionAmount.toFixed(2)} comm</span>
        </div>
      );
    }
    return <span className="text-green-600 font-semibold">₹{tx.netAmount?.toFixed(2)}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <header className="bg-white shadow-sm border-b sticky top-0 z-40 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <i className="fas fa-leaf"></i>
            </div>
            <h1 className="text-xl font-bold">{t.adminCenter}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <LanguageSelector />
            <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600">
              <i className="fas fa-sign-out-alt text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-indigo-500">
            <div className="text-sm text-gray-500">{t.farmers}</div>
            <div className="text-2xl font-black">{stats.farmerCount || 0}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-500">
            <div className="text-sm text-gray-500">{t.pending}</div>
            <div className="text-2xl font-black text-orange-600">{stats.pendingCount || 0}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500">
            <div className="text-sm text-gray-500">{t.revenue}</div>
            <div className="text-2xl font-black text-green-600">₹{(stats.totalRevenue || 0).toFixed(0)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500">
            <div className="text-sm text-gray-500">{t.volume}</div>
            <div className="text-2xl font-black text-blue-600">{(stats.totalWeight || 0).toFixed(1)} {t.kg}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('farmers')} 
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'farmers' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
          >
            {t.farmerWise}
          </button>
          <button 
            onClick={() => setActiveTab('flowers')} 
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'flowers' ? 'bg-pink-600 text-white' : 'bg-white border'}`}
          >
            <i className="fas fa-seedling mr-2"></i>{t.manageFlowers}
          </button>
          <button 
            onClick={() => setActiveTab('add')} 
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'add' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
          >
            {t.addUser}
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
          >
            {t.manageUsers}
          </button>
        </div>

        {activeTab === 'farmers' && (
          <div className="space-y-4">
            {farmers.map(farmer => {
              const farmerTx = getFarmerTransactions(farmer._id);
              const pending = farmerTx.filter(t => t.status === 'PRICE_PENDING').length;
              const totalWeight = farmerTx.reduce((sum, t) => sum + t.weightKg, 0);
              const totalNet = farmerTx.reduce((sum, t) => sum + (t.netAmount || 0), 0);
              const totalCommission = farmerTx.reduce((sum, t) => sum + (t.commissionAmount || 0), 0);
              const resaleCount = farmerTx.filter(t => t.transactionType === 'BUYER_TO_BUYER').length;
              
              return (
                <div key={farmer._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 card-hover">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
                          {farmer.fullName[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{farmer.fullName}</h3>
                          <p className="text-indigo-100 text-sm flex items-center gap-2">
                            {farmer.phone} • {farmerTx.length} txns
                            {resaleCount > 0 && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/40">
                                {resaleCount} resale
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${farmer.preferredChannel === 'WHATSAPP' ? 'bg-green-500/30' : 'bg-blue-500/30'}`}>
                              {farmer.preferredChannel}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black">{totalWeight.toFixed(2)} {t.kg}</div>
                        {totalNet > 0 && (
                          <div className="text-xs text-indigo-100">
                            Net: ₹{totalNet.toFixed(0)} {totalCommission > 0 && `(Comm: ₹${totalCommission.toFixed(0)})`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left">{t.time}</th>
                          <th className="px-3 py-2 text-left">{t.flower}</th>
                          <th className="px-3 py-2 text-right">{t.weight}</th>
                          <th className="px-3 py-2 text-center min-w-[180px]">Buyer / Seller</th>
                          <th className="px-3 py-2 text-right">{t.net}</th>
                          <th className="px-3 py-2 text-center">{t.status}</th>
                          <th className="px-3 py-2 text-center">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farmerTx.slice(0, 5).map(tx => (
                          <tr key={tx._id} className="border-b hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-600 text-xs">{new Date(tx.createdAt).toLocaleTimeString()}</td>
                            <td className="px-3 py-2 font-medium">{tx.flowerName}</td>
                            <td className="px-3 py-2 text-right font-mono">{tx.weightKg} {t.kg}</td>
                            <td className="px-3 py-2 text-center">
                              {getBuyerDisplay(tx)}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {getCommissionDisplay(tx)}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.status === 'PRICE_APPLIED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                {tx.status === 'PRICE_APPLIED' ? t.paid : t.pendingStatus}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${tx.transactionType === 'BUYER_TO_BUYER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {tx.transactionType === 'BUYER_TO_BUYER' ? 'Resale' : 'Direct'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {farmerTx.length} transactions
                        {resaleCount > 0 && (
                          <span className="ml-2 text-purple-600 font-semibold">
                            ({resaleCount} resale @ 5% comm)
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {pending > 0 && (
                          <button 
                            onClick={() => handleFixPrices(farmer._id)} 
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition"
                          >
                            {t.fixPrices} ({pending})
                          </button>
                        )}
                        <button
                          onClick={() => handleSettlement(farmer._id, farmer.fullName)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
                        >
                          {t.settlement}
                        </button>
                        <button 
                          onClick={() => {
                            const msg = `Settlement: Total ₹${totalNet.toFixed(2)}, Weight ${totalWeight.toFixed(2)}kg${totalCommission > 0 ? `, Commission: ₹${totalCommission.toFixed(2)}` : ''}`;
                            window.open(`https://wa.me/${farmer.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                          }} 
                          className="whatsapp-btn text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition"
                        >
                          <i className="fab fa-whatsapp"></i> {t.sendStatement}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'flowers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-pink-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-plus-circle text-pink-600"></i> {t.addNewFlower}
              </h3>
              <form onSubmit={handleAddFlower} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  type="text" 
                  placeholder={t.flowerName} 
                  value={newFlowerName}
                  onChange={(e) => setNewFlowerName(e.target.value)}
                  className="p-4 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required 
                />
                <input 
                  type="number" 
                  placeholder={t.basePrice} 
                  value={newFlowerPrice}
                  onChange={(e) => setNewFlowerPrice(e.target.value)}
                  className="p-4 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required 
                  min="1"
                  step="0.01"
                />
                <button type="submit" className="bg-pink-600 text-white font-bold py-4 rounded-xl hover:bg-pink-700 transition-colors">
                  <i className="fas fa-plus mr-2"></i> {t.addNewFlower}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-b">
                <h3 className="text-xl font-bold text-gray-800">{t.flowerManagement}</h3>
                <p className="text-sm text-gray-600 mt-1">Edit prices or remove flowers from the system</p>
              </div>
              <div className="divide-y">
                {flowers.map((flower) => (
                  <div key={flower._id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {flower.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">{flower.name}</h4>
                        <p className="text-sm text-gray-500">ID: {flower._id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {editingFlower === flower._id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            defaultValue={flower.basePrice}
                            id={`price-${flower._id}`}
                            className="w-32 p-2 border-2 border-indigo-500 rounded-lg text-right font-bold"
                            step="0.01"
                            min="0"
                          />
                          <button 
                            onClick={() => handleUpdateFlower(flower._id, document.getElementById(`price-${flower._id}`).value)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button 
                            onClick={() => setEditingFlower(null)}
                            className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-black text-indigo-600">₹{flower.basePrice}</div>
                            <button
                              onClick={() => handleApplyPrice(flower.name)}
                              className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition"
                            >
                              Apply Price
                            </button>
                            <div className="text-xs text-gray-500">{t.pricePerKg}</div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setEditingFlower(flower._id)}
                              className="p-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors"
                              title={t.edit}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteFlower(flower._id)}
                              className="p-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                              title={t.delete}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {flowers.length === 0 && (
                  <div className="p-12 text-center text-gray-400">
                    <i className="fas fa-seedling text-4xl mb-2"></i>
                    <p>No flowers in database</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl">
            <h3 className="text-xl font-bold mb-4">{t.createAccount}</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <select name="role" className="w-full p-4 border rounded-xl" required>
                  <option value="FARMER">{t.farmer}</option>
                  <option value="BUYER">{t.buyer}</option>
                </select>
                <select name="channel" className="w-full p-4 border rounded-xl" required>
                  <option value="WHATSAPP">WhatsApp</option>
                </select>
              </div>
              <input name="fullName" placeholder={t.fullName} className="w-full p-4 border rounded-xl" required />
              <input name="email" type="email" placeholder={t.email} className="w-full p-4 border rounded-xl" required />
              <input name="phone" placeholder={t.phone} className="w-full p-4 border rounded-xl" required />
              <input name="password" type="password" placeholder={t.passwordOptional} className="w-full p-4 border rounded-xl" />
              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition">
                {t.createBtn}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">{t.manageUsers}</h3>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${u.role === 'ADMIN' ? 'bg-purple-500' : u.role === 'BUYER' ? 'bg-blue-500' : 'bg-green-500'}`}>
                      {u.fullName[0]}
                    </div>
                    <div>
                      <div className="font-bold">
                        {u.fullName} 
                        <span className="text-xs text-gray-400 px-2 py-1 bg-gray-200 rounded-full ml-2">{u.preferredChannel}</span>
                      </div>
                      <div className="text-xs text-gray-500">{u.role} • {u.email}</div>
                    </div>
                  </div>
                  {u.role !== 'ADMIN' && (
                    <button 
                      onClick={() => handleToggleUser(u._id)} 
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    >Create Account
                      {u.status === 'ACTIVE' ? t.active : t.inactive}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;