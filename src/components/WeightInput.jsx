import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const WeightInput = ({ onWeightLock }) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState('auto');
  const [weight, setWeight] = useState(0);
  const [manualWeight, setManualWeight] = useState('');
  const [stable, setStable] = useState(false);
  const [readings, setReadings] = useState([]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (mode !== 'auto' || locked) return;
    const interval = setInterval(() => {
      if (!stable) {
        const newWeight = Math.max(0.1, 4.500 + (Math.random() - 0.5) * 0.08);
        setWeight(newWeight);
        setReadings(prev => [...prev.slice(-4), newWeight]);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [mode, stable, locked]);

  useEffect(() => {
    if (mode === 'auto' && readings.length >= 5 && !locked) {
      const variance = Math.max(...readings) - Math.min(...readings);
      if (variance < 0.03 && weight > 0.1) {
        setStable(true);
        setLocked(true);
        onWeightLock(weight.toFixed(3));
      }
    }
  }, [readings, mode, weight, locked, onWeightLock]);

  const handleManual = () => {
    const val = parseFloat(manualWeight);
    if (!isNaN(val) && val > 0) {
      setLocked(true);
      onWeightLock(val.toFixed(3));
    }
  };

  const reset = () => {
    setLocked(false);
    setStable(false);
    setReadings([]);
    setWeight(0);
    setManualWeight('');
    onWeightLock(null);
  };

  return (
    <div className="space-y-4">
      {!locked && (
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => { reset(); setMode('auto'); }} 
            className={`p-4 rounded-xl border-2 ${mode === 'auto' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}
          >
            <i className="fas fa-weight-hanging text-2xl text-indigo-600 mb-2"></i>
            <div className="font-bold">{t.autoScale}</div>
          </button>
          <button 
            onClick={() => { reset(); setMode('manual'); }} 
            className={`p-4 rounded-xl border-2 ${mode === 'manual' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
          >
            <i className="fas fa-keyboard text-2xl text-orange-600 mb-2"></i>
            <div className="font-bold">{t.manualEntry}</div>
          </button>
        </div>
      )}

      {mode === 'auto' && (
        <div className={`rounded-2xl border-2 p-6 ${stable ? 'border-green-400 bg-green-50' : 'border-amber-400 bg-amber-50'}`}>
          <div className="text-center py-6">
            <div className="text-5xl font-black font-mono">
              {weight.toFixed(3)} <span className="text-2xl text-gray-500">{t.kg}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {stable ? `✓ ${t.stableLocked}` : <><i className="fas fa-spinner fa-spin"></i> {t.placeOnScale}</>}
            </div>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <div className={`rounded-2xl border-2 p-6 ${locked ? 'border-green-400 bg-green-50' : 'border-orange-400 bg-orange-50'}`}>
          {!locked ? (
            <div className="space-y-3">
              <input 
                type="number" 
                step="0.001" 
                value={manualWeight} 
                onChange={(e) => setManualWeight(e.target.value)} 
                className="w-full text-4xl font-black text-center py-4 bg-white border-2 border-orange-300 rounded-xl" 
                placeholder={t.weightPlaceholder} 
              />
              <button 
                onClick={handleManual} 
                disabled={!manualWeight} 
                className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold disabled:opacity-50"
              >
                {t.lockWeight}
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl font-black">{parseFloat(manualWeight).toFixed(3)} {t.kg}</div>
              <div className="text-green-700 font-semibold mt-2">✓ {t.manuallyVerified}</div>
            </div>
          )}
        </div>
      )}

      {locked && (
        <button 
          onClick={reset} 
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold border"
        >
          <i className="fas fa-redo mr-2"></i>{t.reset}
        </button>
      )}
    </div>
  );
};

export default WeightInput;  