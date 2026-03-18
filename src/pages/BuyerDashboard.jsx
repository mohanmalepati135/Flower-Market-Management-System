


// import React, { useState, useEffect } from 'react';
// import { useLanguage } from '../contexts/LanguageContext';
// import { useAuth } from '../contexts/AuthContext';
// import LanguageSelector from '../components/LanguageSelector';
// import Toast from '../components/Toast';
// import WeightInput from '../components/WeightInput';
// import api from '../services/api';
// import messageService from '../services/messageService';

// const BuyerDashboard = () => {
//   const { t, lang } = useLanguage();
//   const { user, logout } = useAuth();
//   const [activeTab, setActiveTab] = useState('buy');
//   const [farmers, setFarmers] = useState([]);
//   const [buyers, setBuyers] = useState([]);
//   const [flowers, setFlowers] = useState([]);
//   const [myTransactions, setMyTransactions] = useState([]);
//   const [groupedTransactions, setGroupedTransactions] = useState({});
//   const [toast, setToast] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const [selectedFarmer, setSelectedFarmer] = useState('');
//   const [selectedFlower, setSelectedFlower] = useState('');
//   const [weight, setWeight] = useState(null);
  
//   const [resaleFarmer, setResaleFarmer] = useState('');
//   const [resaleBuyer, setResaleBuyer] = useState('');
//   const [resaleWeight, setResaleWeight] = useState(null);

//   useEffect(() => {
//     fetchFarmers();
//     fetchBuyers();
//     fetchFlowers();
//     fetchMyTransactions();
//     const interval = setInterval(fetchMyTransactions, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // Fetch farmers 
//   const fetchFarmers = async () => {
//     try {
//       const res = await api.get('/users/farmers');
//       setFarmers(res.data);
//       console.log('Farmers loaded:', res.data.length);
//     } catch (error) {
//       console.error('Error fetching farmers:', error.response?.data || error.message);
//       setToast({ message: 'Failed to load farmers', type: 'error' });
//     }
//   };

//   // Fetch buyers (public endpoint)
//   const fetchBuyers = async () => {
//     try {
//       const res = await api.get('/users/buyers');
//       setBuyers(res.data);
//     } catch (error) {
//       console.error('Error fetching buyers:', error);
//     }
//   };

//   const fetchFlowers = async () => {
//     try {
//       const res = await api.get('/flowers');
//       setFlowers(res.data);
//     } catch (error) {
//       console.error('Error fetching flowers:', error);
//     }
//   };

//   const fetchMyTransactions = async () => {
//     try {
//       const res = await api.get('/transactions?involved=' + user._id);
//       const transactions = res.data;
//       setMyTransactions(transactions);
      
//       // Group by farmer
//       const grouped = groupByFarmer(transactions);
//       setGroupedTransactions(grouped);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching transactions:', error);
//       setLoading(false);
//     }
//   };

//   // Group transactions by farmer
//   const groupByFarmer = (transactions) => {
//     const grouped = {};
    
//     transactions.forEach(tx => {
//       const farmerId = tx.farmer?._id || tx.farmer;
//       const farmerName = tx.farmer?.fullName || 'Unknown Farmer';
//       const farmerPhone = tx.farmer?.phone || '';
      
//       if (!grouped[farmerId]) {
//         grouped[farmerId] = {
//           farmer: tx.farmer,
//           farmerName,
//           farmerPhone,
//           transactions: [],
//           totalWeight: 0,
//           totalGross: 0,
//           totalCommission: 0,
//           totalNet: 0,
//           pendingCount: 0,
//           settledCount: 0
//         };
//       }
      
//       grouped[farmerId].transactions.push(tx);
//       grouped[farmerId].totalWeight += tx.weightKg || 0;
//       grouped[farmerId].totalGross += tx.grossAmount || 0;
//       grouped[farmerId].totalCommission += tx.commissionAmount || 0;
//       grouped[farmerId].totalNet += tx.netAmount || 0;
      
//       if (tx.status === 'PRICE_PENDING') {
//         grouped[farmerId].pendingCount++;
//       } else {
//         grouped[farmerId].settledCount++;
//       }
//     });
    
//     return grouped;
//   };

//   const handleBuy = async () => {
//     if (!weight || !selectedFarmer || !selectedFlower) {
//       setToast({ message: 'Please select farmer, flower and weight', type: 'error' });
//       return;
//     }
    
//     const farmer = farmers.find(f => f._id === selectedFarmer);
//     const flowerName = flowers.find(f => f._id === selectedFlower)?.name;
    
//     if (!farmer) {
//       setToast({ message: 'Farmer not found', type: 'error' });
//       return;
//     }
    
//     try {
//       const res = await api.post('/transactions', {
//         transactionType: 'FARMER_TO_BUYER',
//         farmer: selectedFarmer,
//         buyer: user._id,
//         flowerName: flowerName,
//         weightKg: parseFloat(weight)
//       });
      
//       const tx = res.data;
      
//       await messageService.sendMessage(farmer, {
//         type: 'supply',
//         tx,
//         farmer,
//         buyer: user,
//         isResale: false
//       }, lang);
      
//       setToast({ message: t.success, type: 'success' });
//       setSelectedFarmer('');
//       setSelectedFlower('');
//       setWeight(null);
//       fetchMyTransactions();
//     } catch (error) {
//       setToast({ message: error.response?.data?.message || 'Error recording purchase', type: 'error' });
//     }
//   };

//   const handleResale = async () => {
//     if (!resaleWeight || !resaleFarmer || !resaleBuyer) {
//       setToast({ message: 'Please fill all fields', type: 'error' });
//       return;
//     }
    
//     const farmer = farmers.find(f => f._id === resaleFarmer);
//     const newBuyer = buyers.find(b => b._id === resaleBuyer);
    
//     try {
//       const res = await api.post('/transactions', {
//         transactionType: 'BUYER_TO_BUYER',
//         farmer: resaleFarmer,
//         buyer: resaleBuyer,
//         sellerBuyer: user._id,
//         flowerName: flowers[0]?.name || 'Unknown',
//         weightKg: parseFloat(resaleWeight)
//       });
      
//       const tx = res.data;
      
//       await messageService.sendMessage(farmer, {
//         type: 'supply',
//         tx,
//         farmer,
//         buyer: newBuyer,
//         seller: user,
//         isResale: true
//       }, lang);
      
//       await messageService.sendMessage(newBuyer, {
//         type: 'purchase_confirmation',
//         tx,
//         farmer,
//         buyer: newBuyer,
//         seller: user,
//         isResale: true
//       }, lang);
      
//       setToast({ message: 'Resale recorded & both parties notified!', type: 'success' });
//       setResaleFarmer('');
//       setResaleBuyer('');
//       setResaleWeight(null);
//       fetchMyTransactions();
//     } catch (error) {
//       setToast({ message: error.response?.data?.message || 'Error recording resale', type: 'error' });
//     }
//   };

//   const myPurchases = myTransactions.filter(t => t.buyer === user._id);
//   const mySales = myTransactions.filter(t => t.sellerBuyer === user._id);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
//       <header className="bg-white shadow-sm border-b sticky top-0 z-40 p-4">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <h1 className="text-xl font-bold text-gray-800">{t.buyerDashboard}</h1>
//           <div className="flex items-center gap-4">
//             <span className="text-sm text-gray-500">{user?.fullName}</span>
//             <LanguageSelector />
//             <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600">
//               <i className="fas fa-sign-out-alt text-xl"></i>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-6">
//         <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
//           <button 
//             onClick={() => setActiveTab('buy')} 
//             className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'buy' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
//           >
//             <i className="fas fa-shopping-basket mr-2"></i>{t.buyFromFarmer}
//           </button>
//           <button 
//             onClick={() => setActiveTab('resale')} 
//             className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'resale' ? 'bg-orange-600 text-white' : 'bg-white border'}`}
//           >
//             <i className="fas fa-exchange-alt mr-2"></i>{t.sellToBuyer}
//           </button>
//           <button 
//             onClick={() => setActiveTab('history')} 
//             className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'history' ? 'bg-purple-600 text-white' : 'bg-white border'}`}
//           >
//             <i className="fas fa-history mr-2"></i>{t.myHistory}
//           </button>
//         </div>

//         {activeTab === 'buy' && (
//           <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg space-y-6 fade-in">
//             <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//               <i className="fas fa-shopping-basket text-indigo-600"></i> {t.buyFromFarmer}
//             </h2>
//             <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
//               <p className="text-sm text-blue-800">
//                 <i className="fas fa-info-circle mr-2"></i>
//                 Direct purchases from farmers have <strong>0% commission</strong>. Commission (5%) is only deducted for resale transactions.
//               </p>
//             </div>
            
//             {/* Debug info */}
//             {farmers.length === 0 && (
//               <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-yellow-800 text-sm">
//                   <i className="fas fa-exclamation-triangle mr-2"></i>
//                   No farmers available. Please check connection.
//                 </p>
//               </div>
//             )}
            
//             <div>
//               <label className="block text-sm font-bold mb-2 text-gray-700">
//                 {t.selectFarmer} ({farmers.length} available)
//               </label>
//               <select 
//                 value={selectedFarmer} 
//                 onChange={(e) => setSelectedFarmer(e.target.value)} 
//                 className="w-full p-4 border rounded-xl bg-white"
//                 disabled={farmers.length === 0}
//               >
//                 <option value="">-- {t.chooseFarmer} --</option>
//                 {farmers.map(f => (
//                   <option key={f._id} value={f._id}>
//                     {f.fullName} ({f.phone}) [{f.preferredChannel}]
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-bold mb-2 text-gray-700">{t.flowerType}</label>
//               <select 
//                 value={selectedFlower} 
//                 onChange={(e) => setSelectedFlower(e.target.value)} 
//                 className="w-full p-4 border rounded-xl bg-white"
//               >
//                 <option value="">-- {t.selectFlower} --</option>
//                 {flowers.map(f => <option key={f._id} value={f._id}>{f.name} (₹{f.basePrice}/{t.kg})</option>)}
//               </select>
//             </div>

//             <WeightInput onWeightLock={setWeight} />

//             <button 
//               onClick={handleBuy} 
//               disabled={!weight || !selectedFarmer || !selectedFlower} 
//               className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//             >
//               <i className="fas fa-check-circle mr-2"></i> {t.recordPurchase}
//             </button>
//           </div>
//         )}

//         {activeTab === 'resale' && (
//           <div className="max-w-2xl mx-auto bg-orange-50 rounded-2xl p-8 shadow-lg border-2 border-orange-200 space-y-6 fade-in">
//             <div className="flex items-center gap-3 mb-4 text-orange-800">
//               <i className="fas fa-exchange-alt text-2xl"></i>
//               <h2 className="text-2xl font-bold">{t.resaleTitle}</h2>
//             </div>
            
//             <div className="bg-orange-100 rounded-xl p-4 text-sm text-orange-800 border border-orange-200">
//               <i className="fas fa-info-circle mr-2"></i>{t.resaleInfo}
//               <div className="mt-2 font-semibold text-red-600">
//                 <i className="fas fa-percentage mr-1"></i> 5% Commission will be deducted from farmer's payment
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-bold mb-2 text-gray-700">{t.originalFarmer}</label>
//               <select 
//                 value={resaleFarmer} 
//                 onChange={(e) => setResaleFarmer(e.target.value)} 
//                 className="w-full p-4 border rounded-xl bg-white"
//               >
//                 <option value="">-- {t.sourceFarmer} --</option>
//                 {farmers.map(f => <option key={f._id} value={f._id}>{f.fullName}</option>)}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-bold mb-2 text-gray-700">{t.weight}</label>
//               <WeightInput onWeightLock={setResaleWeight} />
//             </div>

//             <div>
//               <label className="block text-sm font-bold mb-2 text-gray-700">{t.sellTo}</label>
//               <select 
//                 value={resaleBuyer} 
//                 onChange={(e) => setResaleBuyer(e.target.value)} 
//                 className="w-full p-4 border border-orange-300 rounded-xl bg-white"
//               >
//                 <option value="">-- {t.selectBuyer} --</option>
//                 {buyers.map(b => (
//                   <option key={b._id} value={b._id}>
//                     {b.fullName} ({b.phone}) [{b.preferredChannel}]
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <button 
//               onClick={handleResale} 
//               disabled={!resaleWeight || !resaleFarmer || !resaleBuyer} 
//               className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 shadow-lg"
//             >
//               <i className="fas fa-paper-plane mr-2"></i> {t.recordResale}
//             </button>
//           </div>
//         )}

//         {activeTab === 'history' && (
//           <div className="space-y-6 fade-in">
//             {/* Summary Cards */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-indigo-500">
//                 <div className="text-gray-500 text-sm font-bold">{t.purchaseHistory}</div>
//                 <div className="text-3xl font-black text-indigo-600">{myPurchases.length}</div>
//                 <div className="text-xs text-gray-400">transactions</div>
//               </div>
//               <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
//                 <div className="text-gray-500 text-sm font-bold">{t.salesHistory}</div>
//                 <div className="text-3xl font-black text-orange-600">{mySales.length}</div>
//                 <div className="text-xs text-gray-400">transactions</div>
//               </div>
//               <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
//                 <div className="text-gray-500 text-sm font-bold">Total Volume</div>
//                 <div className="text-3xl font-black text-green-600">
//                   {myTransactions.reduce((sum, t) => sum + (t.weightKg || 0), 0).toFixed(1)} {t.kg}
//                 </div>
//               </div>
//               <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
//                 <div className="text-gray-500 text-sm font-bold">Farmers</div>
//                 <div className="text-3xl font-black text-blue-600">
//                   {Object.keys(groupedTransactions).length}
//                 </div>
//               </div>
//             </div>

//             {/* Farmer-wise Grouped History */}
//             <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//               <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
//                 <h3 className="text-xl font-bold flex items-center gap-2">
//                   <i className="fas fa-users"></i> Transaction History by Farmer
//                 </h3>
//                 <p className="text-indigo-100 text-sm mt-1">Grouped by farmer with totals</p>
//               </div>
              
//               <div className="divide-y">
//                 {loading ? (
//                   <div className="p-12 text-center text-gray-400">
//                     <i className="fas fa-spinner fa-spin text-4xl mb-2"></i>
//                     <p>Loading...</p>
//                   </div>
//                 ) : Object.keys(groupedTransactions).length === 0 ? (
//                   <div className="p-12 text-center text-gray-400">
//                     <i className="fas fa-shopping-basket text-4xl mb-2"></i>
//                     <p>{t.noPurchases}</p>
//                   </div>
//                 ) : (
//                   Object.values(groupedTransactions).map((group) => (
//                     <div key={group.farmer?._id || group.farmerName} className="p-6 hover:bg-gray-50 transition-colors border-b">
//                       {/* Farmer Header */}
//                       <div className="flex justify-between items-start mb-4 p-4 bg-gray-50 rounded-xl">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                             {group.farmerName[0]}
//                           </div>
//                           <div>
//                             <h4 className="font-bold text-lg text-gray-800">{group.farmerName}</h4>
//                             <p className="text-sm text-gray-600">{group.farmerPhone}</p>
//                             <div className="flex gap-2 mt-1">
//                               <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
//                                 {group.transactions.length} transactions
//                               </span>
//                               {group.pendingCount > 0 && (
//                                 <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
//                                   {group.pendingCount} pending
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-2xl font-black text-green-600">₹{group.totalNet.toFixed(0)}</div>
//                           <div className="text-sm text-gray-500">Total Net</div>
//                           <div className="text-xs text-gray-400 mt-1">
//                             {group.totalWeight.toFixed(1)} {t.kg} total
//                           </div>
//                           {group.totalCommission > 0 && (
//                             <div className="text-xs text-orange-600">
//                               Commission: ₹{group.totalCommission.toFixed(0)}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Transactions List for this Farmer */}
//                       <div className="space-y-3 pl-4">
//                         <h5 className="font-semibold text-gray-700 mb-2">Transactions:</h5>
//                         {group.transactions.map(tx => {
//                           const isResale = tx.transactionType === 'BUYER_TO_BUYER';
                          
//                           return (
//                             <div key={tx._id} className="flex justify-between items-center p-3 bg-white border rounded-lg">
//                               <div className="flex-1">
//                                 <div className="flex items-center gap-2 mb-1">
//                                   <span className={`text-xs px-2 py-1 rounded ${isResale ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
//                                     {isResale ? t.resale : t.directPurchase}
//                                   </span>
//                                   <span className={`text-xs px-2 py-1 rounded ${tx.status === 'PRICE_APPLIED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
//                                     {tx.status === 'PRICE_APPLIED' ? t.paid : t.pendingStatus}
//                                   </span>
//                                 </div>
//                                 <div className="font-medium text-gray-800">{tx.flowerName}</div>
//                                 <div className="text-xs text-gray-500">
//                                   {new Date(tx.createdAt).toLocaleString()}
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="font-bold text-gray-800">{tx.weightKg} {t.kg}</div>
//                                 {tx.status === 'PRICE_APPLIED' && (
//                                   <div className="text-sm text-green-600">₹{tx.netAmount?.toFixed(0)}</div>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Sales History (if any) */}
//             {mySales.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//                 <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
//                   <h3 className="text-xl font-bold flex items-center gap-2">
//                     <i className="fas fa-hand-holding-usd"></i> {t.salesHistory}
//                   </h3>
//                   <p className="text-orange-100 text-sm mt-1">Items you sold to other buyers</p>
//                 </div>
//                 <div className="divide-y">
//                   {mySales.map(tx => {
//                     const toUser = tx.buyer?.fullName || 'Unknown';
//                     const farmer = tx.farmer?.fullName || 'Unknown';
                    
//                     return (
//                       <div key={tx._id} className="p-6 hover:bg-gray-50 transition-colors">
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-2 mb-2">
//                               <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
//                                 {t.resale}
//                               </span>
//                               <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
//                                 {new Date(tx.createdAt).toLocaleDateString()}
//                               </span>
//                             </div>
                            
//                             <h4 className="text-lg font-bold text-gray-800 mb-1">{tx.flowerName}</h4>
                            
//                             <div className="text-sm text-gray-600 space-y-1">
//                               <div className="flex items-center gap-2">
//                                 <span className="font-semibold">{t.to}:</span>
//                                 <span className="bg-orange-100 px-2 py-1 rounded">{toUser}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <span className="font-semibold">Farmer Source:</span>
//                                 <span className="bg-gray-100 px-2 py-1 rounded">{farmer}</span>
//                               </div>
//                               <div className="flex items-center gap-2">
//                                 <span className="font-semibold">{t.weight}:</span>
//                                 <span className="font-mono font-bold">{tx.weightKg} {t.kg}</span>
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="text-right ml-4">
//                             <div className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-bold">
//                               You are Seller
//                             </div>
//                             <div className="text-xs text-gray-500 mt-2">Commission charged to farmer</div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default BuyerDashboard;


import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import Toast from '../components/Toast';
import WeightInput from '../components/WeightInput';
import api from '../services/api';
import messageService from '../services/messageService';

const BuyerDashboard = () => {
  const { t, lang } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('buy');
  const [farmers, setFarmers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedFlower, setSelectedFlower] = useState('');
  const [weight, setWeight] = useState(null);
  
  const [resaleFarmer, setResaleFarmer] = useState('');
  const [resaleBuyer, setResaleBuyer] = useState('');
  const [resaleWeight, setResaleWeight] = useState(null);

  useEffect(() => {
    fetchFarmers();
    fetchBuyers();
    fetchFlowers();
    fetchMyTransactions();
    const interval = setInterval(fetchMyTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch farmers 
  const fetchFarmers = async () => {
    try {
      const res = await api.get('/users/farmers');
      setFarmers(res.data || []);
      console.log('Farmers loaded:', res.data?.length || 0);
    } catch (error) {
      console.error('Error fetching farmers:', error.response?.data || error.message);
      setToast({ message: 'Failed to load farmers', type: 'error' });
    }
  };

  // Fetch buyers (public endpoint)
  const fetchBuyers = async () => {
    try {
      const res = await api.get('/users/buyers');
      setBuyers(res.data || []);
    } catch (error) {
      console.error('Error fetching buyers:', error);
    }
  };

  const fetchFlowers = async () => {
    try {
      const res = await api.get('/flowers');
      setFlowers(res.data || []);
    } catch (error) {
      console.error('Error fetching flowers:', error);
    }
  };

  const fetchMyTransactions = async () => {
    try {
      const res = await api.get('/transactions?involved=' + user._id);
      const transactions = res.data || [];
      setMyTransactions(transactions);
      
      // Group by farmer
      const grouped = groupByFarmer(transactions);
      setGroupedTransactions(grouped);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  // Group transactions by farmer - SAFER VERSION
  const groupByFarmer = (transactions) => {
    const grouped = {};
    
    transactions.forEach(tx => {
      // Safely access farmer data
      const farmerData = tx.farmer || {};
      const farmerId = farmerData._id || tx.farmer || 'unknown';
      const farmerName = farmerData.fullName || 'Unknown Farmer';
      const farmerPhone = farmerData.phone || '';
      
      if (!grouped[farmerId]) {
        grouped[farmerId] = {
          farmer: farmerData,
          farmerName,
          farmerPhone,
          transactions: [],
          totalWeight: 0,
          totalGross: 0,
          totalCommission: 0,
          totalNet: 0,
          pendingCount: 0,
          settledCount: 0
        };
      }
      
      grouped[farmerId].transactions.push(tx);
      grouped[farmerId].totalWeight += (tx.weightKg || 0);
      grouped[farmerId].totalGross += (tx.grossAmount || 0);
      grouped[farmerId].totalCommission += (tx.commissionAmount || 0);
      grouped[farmerId].totalNet += (tx.netAmount || 0);
      
      if (tx.status === 'PRICE_PENDING') {
        grouped[farmerId].pendingCount++;
      } else {
        grouped[farmerId].settledCount++;
      }
    });
    
    return grouped;
  };

  const handleBuy = async () => {
    if (!weight || !selectedFarmer || !selectedFlower) {
      setToast({ message: 'Please select farmer, flower and weight', type: 'error' });
      return;
    }
    
    const farmer = farmers.find(f => f._id === selectedFarmer);
    const flowerName = flowers.find(f => f._id === selectedFlower)?.name;
    
    if (!farmer) {
      setToast({ message: 'Farmer not found', type: 'error' });
      return;
    }
    
    try {
      const res = await api.post('/transactions', {
        transactionType: 'FARMER_TO_BUYER',
        farmer: selectedFarmer,
        buyer: user._id,
        flowerName: flowerName,
        weightKg: parseFloat(weight)
      });
      
      const tx = res.data;
      
      await messageService.sendMessage(farmer, {
        type: 'supply',
        tx,
        farmer,
        buyer: user,
        isResale: false
      }, lang);
      
      setToast({ message: t.success, type: 'success' });
      setSelectedFarmer('');
      setSelectedFlower('');
      setWeight(null);
      fetchMyTransactions();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Error recording purchase', type: 'error' });
    }
  };

  const handleResale = async () => {
    if (!resaleWeight || !resaleFarmer || !resaleBuyer) {
      setToast({ message: 'Please fill all fields', type: 'error' });
      return;
    }
    
    const farmer = farmers.find(f => f._id === resaleFarmer);
    const newBuyer = buyers.find(b => b._id === resaleBuyer);
    
    try {
      const res = await api.post('/transactions', {
        transactionType: 'BUYER_TO_BUYER',
        farmer: resaleFarmer,
        buyer: resaleBuyer,
        sellerBuyer: user._id,
        flowerName: flowers[0]?.name || 'Unknown',
        weightKg: parseFloat(resaleWeight)
      });
      
      const tx = res.data;
      
      await messageService.sendMessage(farmer, {
        type: 'supply',
        tx,
        farmer,
        buyer: newBuyer,
        seller: user,
        isResale: true
      }, lang);
      
      await messageService.sendMessage(newBuyer, {
        type: 'purchase_confirmation',
        tx,
        farmer,
        buyer: newBuyer,
        seller: user,
        isResale: true
      }, lang);
      
      setToast({ message: 'Resale recorded & both parties notified!', type: 'success' });
      setResaleFarmer('');
      setResaleBuyer('');
      setResaleWeight(null);
      fetchMyTransactions();
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Error recording resale', type: 'error' });
    }
  };

  // FIXED: Helper to display buyer/seller info for transactions with safe property access
  const getTransactionParties = (tx) => {
    if (!tx) return <span>Unknown</span>;
    
    const isResale = tx.transactionType === 'BUYER_TO_BUYER';
    
    // Safely get buyer data
    const buyerData = tx.buyer || {};
    const buyerId = buyerData._id || tx.buyer;
    const buyerName = buyerData.fullName || 'Unknown';
    
    // Safely get seller data
    const sellerData = tx.sellerBuyer || {};
    const sellerId = sellerData._id || tx.sellerBuyer;
    const sellerName = sellerData.fullName || 'Unknown';
    
    // Safely get farmer data
    const farmerData = tx.farmer || {};
    const farmerName = farmerData.fullName || 'Unknown';
    
    if (isResale && sellerId) {
      // If current user is the seller
      if (sellerId === user._id || (typeof sellerId === 'string' && sellerId === user._id)) {
        return (
          <div className="flex flex-col">
            <span className="font-bold text-purple-700">You sold to {buyerName}</span>
            <span className="text-xs text-gray-500">Farmer: {farmerName}</span>
          </div>
        );
      }
      
      // If current user is the final buyer
      if (buyerId === user._id || (typeof buyerId === 'string' && buyerId === user._id)) {
        return (
          <div className="flex flex-col">
            <span className="font-bold text-purple-700">Bought from {sellerName}</span>
            <span className="text-xs text-gray-500">Farmer: {farmerName}</span>
          </div>
        );
      }
      
      // For other cases - show both names
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-purple-700">{buyerName}</span>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-400">←</span>
            <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{sellerName}</span>
            <span className="text-gray-400">(Seller)</span>
          </div>
        </div>
      );
    }
    
    // Direct purchase
    const isYou = (buyerId === user._id) || (typeof buyerId === 'string' && buyerId === user._id);
    return (
      <span className="font-bold text-blue-700">
        {isYou ? 'You' : buyerName}
      </span>
    );
  };

  // FIXED: Get commission display with safe property access
  const getCommissionDisplay = (tx) => {
    if (!tx) return <span>₹0</span>;
    
    const netAmount = tx.netAmount || 0;
    const commissionAmount = tx.commissionAmount || 0;
    
    if (tx.transactionType === 'BUYER_TO_BUYER' && commissionAmount > 0) {
      return (
        <div className="flex flex-col items-end">
          <span className="text-green-600 font-semibold">₹{netAmount.toFixed(2)}</span>
          <span className="text-xs text-red-500">-₹{commissionAmount.toFixed(2)} comm</span>
        </div>
      );
    }
    return <span className="text-green-600 font-semibold">₹{netAmount.toFixed(2)}</span>;
  };

  const myPurchases = myTransactions.filter(t => {
    const buyerId = t.buyer?._id || t.buyer;
    return buyerId === user._id;
  });
  
  const mySales = myTransactions.filter(t => {
    const sellerId = t.sellerBuyer?._id || t.sellerBuyer;
    return sellerId === user._id;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="bg-white shadow-sm border-b sticky top-0 z-40 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">{t.buyerDashboard}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.fullName}</span>
            <LanguageSelector />
            <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600">
              <i className="fas fa-sign-out-alt text-xl"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('buy')} 
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'buy' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}
          >
            <i className="fas fa-shopping-basket mr-2"></i>{t.buyFromFarmer}
          </button>
          <button 
            onClick={() => setActiveTab('resale')} 
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'resale' ? 'bg-orange-600 text-white' : 'bg-white border'}`}
          >
            <i className="fas fa-exchange-alt mr-2"></i>{t.sellToBuyer}
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === 'history' ? 'bg-purple-600 text-white' : 'bg-white border'}`}
          >
            <i className="fas fa-history mr-2"></i>{t.myHistory}
          </button>
        </div>

        {activeTab === 'buy' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-lg space-y-6 fade-in">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <i className="fas fa-shopping-basket text-indigo-600"></i> {t.buyFromFarmer}
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                Direct purchases from farmers have <strong>0% commission</strong>. Commission (5%) is only deducted for resale transactions.
              </p>
            </div>
            
            {farmers.length === 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  No farmers available. Please check connection.
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                {t.selectFarmer} ({farmers.length} available)
              </label>
              <select 
                value={selectedFarmer} 
                onChange={(e) => setSelectedFarmer(e.target.value)} 
                className="w-full p-4 border rounded-xl bg-white"
                disabled={farmers.length === 0}
              >
                <option value="">-- {t.chooseFarmer} --</option>
                {farmers.map(f => (
                  <option key={f._id} value={f._id}>
                    {f.fullName} ({f.phone}) [{f.preferredChannel}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">{t.flowerType}</label>
              <select 
                value={selectedFlower} 
                onChange={(e) => setSelectedFlower(e.target.value)} 
                className="w-full p-4 border rounded-xl bg-white"
              >
                <option value="">-- {t.selectFlower} --</option>
                {flowers.map(f => <option key={f._id} value={f._id}>{f.name} (₹{f.basePrice}/{t.kg})</option>)}
              </select>
            </div>

            <WeightInput onWeightLock={setWeight} />

            <button 
              onClick={handleBuy} 
              disabled={!weight || !selectedFarmer || !selectedFlower} 
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <i className="fas fa-check-circle mr-2"></i> {t.recordPurchase}
            </button>
          </div>
        )}

        {activeTab === 'resale' && (
          <div className="max-w-2xl mx-auto bg-orange-50 rounded-2xl p-8 shadow-lg border-2 border-orange-200 space-y-6 fade-in">
            <div className="flex items-center gap-3 mb-4 text-orange-800">
              <i className="fas fa-exchange-alt text-2xl"></i>
              <h2 className="text-2xl font-bold">{t.resaleTitle}</h2>
            </div>
            
            <div className="bg-orange-100 rounded-xl p-4 text-sm text-orange-800 border border-orange-200">
              <i className="fas fa-info-circle mr-2"></i>{t.resaleInfo}
              <div className="mt-2 font-semibold text-red-600">
                <i className="fas fa-percentage mr-1"></i> 5% Commission will be deducted from farmer's payment
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">{t.originalFarmer}</label>
              <select 
                value={resaleFarmer} 
                onChange={(e) => setResaleFarmer(e.target.value)} 
                className="w-full p-4 border rounded-xl bg-white"
              >
                <option value="">-- {t.sourceFarmer} --</option>
                {farmers.map(f => <option key={f._id} value={f._id}>{f.fullName}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">{t.weight}</label>
              <WeightInput onWeightLock={setResaleWeight} />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">{t.sellTo}</label>
              <select 
                value={resaleBuyer} 
                onChange={(e) => setResaleBuyer(e.target.value)} 
                className="w-full p-4 border border-orange-300 rounded-xl bg-white"
              >
                <option value="">-- {t.selectBuyer} --</option>
                {buyers.map(b => (
                  <option key={b._id} value={b._id}>
                    {b.fullName} ({b.phone}) [{b.preferredChannel}]
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={handleResale} 
              disabled={!resaleWeight || !resaleFarmer || !resaleBuyer} 
              className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 shadow-lg"
            >
              <i className="fas fa-paper-plane mr-2"></i> {t.recordResale}
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 fade-in">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-indigo-500">
                <div className="text-gray-500 text-sm font-bold">{t.purchaseHistory}</div>
                <div className="text-3xl font-black text-indigo-600">{myPurchases.length}</div>
                <div className="text-xs text-gray-400">transactions</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
                <div className="text-gray-500 text-sm font-bold">{t.salesHistory}</div>
                <div className="text-3xl font-black text-orange-600">{mySales.length}</div>
                <div className="text-xs text-gray-400">transactions</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
                <div className="text-gray-500 text-sm font-bold">Total Volume</div>
                <div className="text-3xl font-black text-green-600">
                  {myTransactions.reduce((sum, t) => sum + (t.weightKg || 0), 0).toFixed(1)} {t.kg}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
                <div className="text-gray-500 text-sm font-bold">Farmers</div>
                <div className="text-3xl font-black text-blue-600">
                  {Object.keys(groupedTransactions).length}
                </div>
              </div>
            </div>

            {/* Farmer-wise Grouped History */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <i className="fas fa-users"></i> Transaction History by Farmer
                </h3>
                <p className="text-indigo-100 text-sm mt-1">Grouped by farmer with totals</p>
              </div>
              
              <div className="divide-y">
                {loading ? (
                  <div className="p-12 text-center text-gray-400">
                    <i className="fas fa-spinner fa-spin text-4xl mb-2"></i>
                    <p>Loading...</p>
                  </div>
                ) : Object.keys(groupedTransactions).length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <i className="fas fa-shopping-basket text-4xl mb-2"></i>
                    <p>{t.noPurchases}</p>
                  </div>
                ) : (
                  Object.values(groupedTransactions).map((group, index) => (
                    <div key={group.farmer?._id || index} className="p-6 hover:bg-gray-50 transition-colors border-b">
                      {/* Farmer Header */}
                      <div className="flex justify-between items-start mb-4 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {(group.farmerName || 'U')[0]}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-gray-800">{group.farmerName}</h4>
                            <p className="text-sm text-gray-600">{group.farmerPhone}</p>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {group.transactions.length} transactions
                              </span>
                              {group.pendingCount > 0 && (
                                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                  {group.pendingCount} pending
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-green-600">₹{group.totalNet.toFixed(0)}</div>
                          <div className="text-sm text-gray-500">Total Net</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {group.totalWeight.toFixed(1)} {t.kg} total
                          </div>
                          {group.totalCommission > 0 && (
                            <div className="text-xs text-orange-600">
                              Commission: ₹{group.totalCommission.toFixed(0)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Transactions List for this Farmer */}
                      <div className="space-y-3 pl-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Transactions:</h5>
                        {group.transactions.map(tx => {
                          const isResale = tx.transactionType === 'BUYER_TO_BUYER';
                          
                          return (
                            <div key={tx._id} className="flex justify-between items-center p-3 bg-white border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs px-2 py-1 rounded ${isResale ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {isResale ? t.resale : t.directPurchase}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded ${tx.status === 'PRICE_APPLIED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {tx.status === 'PRICE_APPLIED' ? t.paid : t.pendingStatus}
                                  </span>
                                </div>
                                <div className="font-medium text-gray-800">{tx.flowerName || 'Unknown'}</div>
                                
                                {/* Show Buyer/Seller info for resale */}
                                <div className="mt-1">
                                  {getTransactionParties(tx)}
                                </div>
                                
                                <div className="text-xs text-gray-500">
                                  {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : 'Unknown date'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-800">{(tx.weightKg || 0).toFixed(2)} {t.kg}</div>
                                {tx.status === 'PRICE_APPLIED' && (
                                  <div className="text-sm">
                                    {getCommissionDisplay(tx)}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sales History (if any) */}
            {mySales.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <i className="fas fa-hand-holding-usd"></i> {t.salesHistory}
                  </h3>
                  <p className="text-orange-100 text-sm mt-1">Items you sold to other buyers</p>
                </div>
                <div className="divide-y">
                  {mySales.map(tx => {
                    const toUser = tx.buyer?.fullName || 'Unknown';
                    const farmer = tx.farmer?.fullName || 'Unknown';
                    
                    return (
                      <div key={tx._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                                {t.resale}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                            
                            <h4 className="text-lg font-bold text-gray-800 mb-1">{tx.flowerName || 'Unknown'}</h4>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{t.to}:</span>
                                <span className="bg-orange-100 px-2 py-1 rounded font-bold">{toUser}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">Farmer Source:</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">{farmer}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{t.weight}:</span>
                                <span className="font-mono font-bold">{(tx.weightKg || 0).toFixed(2)} {t.kg}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <div className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-bold">
                              You are Seller
                            </div>
                            <div className="text-xs text-gray-500 mt-2">Commission charged to farmer</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerDashboard;