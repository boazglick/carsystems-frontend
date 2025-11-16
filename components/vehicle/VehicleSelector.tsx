'use client';

import { useState, useEffect } from 'react';
import { Search, Car, X, Check } from 'lucide-react';
import { Vehicle, VEHICLE_BRANDS, getModelsByBrand, getBrandName, getModelName } from '@/types/vehicle';
import { lookupVehicleByLicensePlate, formatVehicle } from '@/lib/vehicle-api';

interface VehicleSelectorProps {
  onVehicleSelect?: (vehicle: Vehicle | null) => void;
  compact?: boolean;
}

export function VehicleSelector({ onVehicleSelect, compact = false }: VehicleSelectorProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [mode, setMode] = useState<'license' | 'manual'>('license');
  const [licensePlate, setLicensePlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manual selection state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Load saved vehicle from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('selectedVehicle');
    if (saved) {
      try {
        const vehicle = JSON.parse(saved);
        setSelectedVehicle(vehicle);
        onVehicleSelect?.(vehicle);
      } catch (e) {
        console.error('Failed to load saved vehicle', e);
      }
    }
  }, []);

  const handleLicensePlateSearch = async () => {
    if (!licensePlate.trim()) {
      setError('נא להזין מספר רישוי');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const vehicle = await lookupVehicleByLicensePlate(licensePlate);
      if (vehicle) {
        setSelectedVehicle(vehicle);
        localStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
        onVehicleSelect?.(vehicle);
      } else {
        setError('רכב לא נמצא. נסה שוב או בחר ידנית');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בחיפוש רכב');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSelection = () => {
    if (!selectedBrand || !selectedModel || !selectedYear) {
      setError('נא לבחור מותג, דגם ושנה');
      return;
    }

    const vehicle: Vehicle = {
      brand: selectedBrand,
      model: selectedModel,
      year: parseInt(selectedYear),
    };

    setSelectedVehicle(vehicle);
    localStorage.setItem('selectedVehicle', JSON.stringify(vehicle));
    onVehicleSelect?.(vehicle);
  };

  const handleClearVehicle = () => {
    setSelectedVehicle(null);
    setLicensePlate('');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    localStorage.removeItem('selectedVehicle');
    onVehicleSelect?.(null);
  };

  const models = selectedBrand ? getModelsByBrand(selectedBrand) : [];
  const years = selectedModel
    ? models.find(m => m.id === selectedModel)?.years || []
    : [];

  if (compact && selectedVehicle) {
    return (
      <div className="bg-navy/5 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Car className="h-5 w-5 text-navy" />
          <div>
            <div className="text-sm text-gray-600">הרכב שלי:</div>
            <div className="font-semibold text-navy">
              {getBrandName(selectedVehicle.brand)} {getModelName(selectedVehicle.model)} {selectedVehicle.year}
            </div>
          </div>
        </div>
        <button
          onClick={handleClearVehicle}
          className="text-gray-500 hover:text-red p-2 rounded-lg hover:bg-white transition-colors"
          title="הסר רכב"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  if (selectedVehicle) {
    return (
      <div className="bg-gradient-to-br from-navy/10 to-navy/5 rounded-2xl p-6 border border-navy/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-navy rounded-full p-3">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">הרכב שלי</div>
              <div className="text-xl font-bold text-navy">
                {getBrandName(selectedVehicle.brand)} {getModelName(selectedVehicle.model)}
              </div>
              <div className="text-sm text-gray-600">
                שנת ייצור: {selectedVehicle.year}
                {selectedVehicle.licensePlate && ` • רישוי: ${selectedVehicle.licensePlate}`}
              </div>
            </div>
          </div>
          <button
            onClick={handleClearVehicle}
            className="text-gray-500 hover:text-red p-2 rounded-lg hover:bg-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-white/60 rounded-lg p-3 flex items-center gap-2">
          <Check className="h-4 w-4 text-green" />
          <span className="text-sm text-gray-700">מוצרים מוצגים עבור הרכב שלך</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-navy mb-1 md:mb-2 flex items-center gap-2">
          <Car className="h-5 w-5 md:h-6 md:w-6" />
          בחר את הרכב שלך
        </h3>
        <p className="text-gray-600 text-xs md:text-sm">
          לקבלת מוצרים תואמים למכונית שלך
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-1 md:gap-2 mb-4 md:mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setMode('license')}
          className={`flex-1 py-2 md:py-2.5 px-2 md:px-4 rounded-md text-sm md:text-base font-medium transition-all ${
            mode === 'license'
              ? 'bg-white text-navy shadow-sm'
              : 'text-gray-600 hover:text-navy'
          }`}
        >
          מספר רישוי
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 py-2 md:py-2.5 px-2 md:px-4 rounded-md text-sm md:text-base font-medium transition-all ${
            mode === 'manual'
              ? 'bg-white text-navy shadow-sm'
              : 'text-gray-600 hover:text-navy'
          }`}
        >
          בחירה ידנית
        </button>
      </div>

      {/* License Plate Mode */}
      {mode === 'license' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            מספר רישוי (7-8 ספרות)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLicensePlateSearch()}
              placeholder="12345678"
              maxLength={8}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-center text-lg sm:text-xl font-bold tracking-wider text-gray-900 placeholder:text-gray-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
            <button
              onClick={handleLicensePlateSearch}
              disabled={loading}
              className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>חפש</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Manual Selection Mode */}
      {mode === 'manual' && (
        <div className="space-y-4">
          {/* Brand */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              יצרן
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel('');
                setSelectedYear('');
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 font-medium focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
            >
              <option value="">בחר יצרן...</option>
              {VEHICLE_BRANDS.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          {selectedBrand && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                דגם
              </label>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  setSelectedYear('');
                }}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 font-medium focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                <option value="">בחר דגם...</option>
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Year */}
          {selectedModel && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                שנת ייצור
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 font-medium focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
              >
                <option value="">בחר שנה...</option>
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleManualSelection}
            disabled={!selectedBrand || !selectedModel || !selectedYear}
            className="w-full bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check className="h-5 w-5" />
            אישור
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red/10 border border-red/20 rounded-lg p-3 text-red text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
