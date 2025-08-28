  let seriesCounter = 0; // Global counter for unique IDs  // Generate random normal number
  const randomNormal = () => {
    const u = Math.random();
    const v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };  const removeSeries = (type, seriesId) => {
    console.log(`=== REMOVE SERIES DEBUG ===`);
    console.log('Type:', type);
    console.log('Series ID to remove:', seriesId);
    
    if (type === 'whiteNoise') {
      console.log('Current white noise series IDs:', whiteNoiseSeries.map(s => s.id));
      setWhiteNoiseSeries(prev => {
        const filtered = prev.filter(series => {
          const keep = series.id !== seriesId;
          console.log(`Series ${series.id} - Keep: ${keep} (comparing ${series.id} !== ${seriesId})`);
          return keep;
        });
        console.log('Filtered result length:', filtered.length, 'vs original:', prev.length);
        return filtered;
      });
    } else if (type === 'randomWalk') {
      console.log('Current random walk series IDs:', randomWalkSeries.map(s => s.id));
      setRandomWalkSeries(prev => {
        const filtered = prev.filter(series => {
          const keep = series.id !== seriesId;
          console.log(`Series ${series.id} - Keep: ${keep} (comparing ${series.id} !== ${seriesId})`);
          return keep;
        });
        console.log('Filtered result length:', filtered.length, 'vs original:', prev.length);
        return filtered;
      });
    } else if (type === 'cyclical') {
      console.log('Current cyclical series IDs:', cyclicalSeries.map(s => s.id));
      setCyclicalSeries(prev => {
        const filtered = prev.filter(series => {
          const keep = series.id !== seriesId;
          console.log(`Series ${series.id} - Keep: ${keep} (comparing ${series.id} !== ${seriesId})`);
          return keep;
        });
        console.log('Filtered result length:', filtered.length, 'vs original:', prev.length);
        return filtered;
      });
    }
    console.log(`=== END DEBUG ===`);
  };

  const formatChartData = (seriesList) => {
    if (seriesList.length === 0) return [];
    
    const maxLength = Math.max(...seriesList.map(s => s.data.length));
    const chartData = [];
    
    for (let t = 0; t < maxLength; t++) {
      const dataPoint = { t };
      seriesList.forEach(series => {
        if (t < series.data.length) {
          dataPoint[`series_${series.id}`] = series.data[t].value;
        }
      });
      chartData.push(dataPoint);
    }
    
    return chartData;
  };import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

const TimeSeriesVisualizer = () => {
  const [whiteNoiseSeries, setWhiteNoiseSeries] = useState([]);
  const [randomWalkSeries, setRandomWalkSeries] = useState([]);
  const [cyclicalSeries, setCyclicalSeries] = useState([]);
  
  const [params, setParams] = useState({
    whiteNoise: { mean: 0, variance: 1, length: 100 },
    randomWalk: { drift: 0.1, variance: 1, initial: 0, length: 100 },
    cyclical: { amplitude: 2, frequency: 0.1, phase: 0, noise: 0.2, length: 100 }
  });

  const getRandomColor = () => {
    const colors = [
      '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', 
      '#c2410c', '#0891b2', '#be185d', '#4338ca', '#059669',
      '#7c2d12', '#b91c1c', '#166534', '#92400e', '#581c87',
      '#0f766e', '#1e40af', '#be123c', '#7c3aed', '#ea580c',
      '#0369a1', '#e11d48', '#15803d', '#a16207', '#7c3aed',
      '#0f172a', '#be185d', '#166534', '#a21caf', '#0891b2',
      '#991b1b', '#064e3b', '#7c2d12', '#6b21a8', '#0c4a6e',
      '#831843', '#14532d', '#78350f', '#4c1d95', '#134e4a',
      '#dc2626', '#16a34a', '#2563eb', '#ca8a04', '#9333ea',
      '#c2410c', '#0891b2', '#be185d', '#4338ca', '#059669'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  let seriesCounter = 0; // Global counter for unique IDs

  const generateWhiteNoise = () => {
    const { mean, variance, length } = params.whiteNoise;
    const std = Math.sqrt(variance);
    const data = [];
    
    for (let i = 0; i < length; i++) {
      const value = mean + std * randomNormal();
      data.push({
        t: i,
        value: parseFloat(value.toFixed(3))
      });
    }
    
    seriesCounter++;
    const id = `wn_${seriesCounter}_${Math.random().toString(36).substr(2, 9)}`;
    const newSeries = {
      id: id,
      data: data,
      color: getRandomColor(),
      name: `Series ${whiteNoiseSeries.length + 1}`
    };
    
    console.log('Creating white noise series with ID:', id);
    setWhiteNoiseSeries(prev => {
      console.log('Adding to white noise series. Current count:', prev.length);
      return [...prev, newSeries];
    });
  };

  const generateRandomWalk = () => {
    const { drift, variance, initial, length } = params.randomWalk;
    const std = Math.sqrt(variance);
    const data = [];
    let currentValue = initial;
    
    for (let i = 0; i < length; i++) {
      if (i > 0) {
        currentValue += drift + std * randomNormal();
      }
      
      data.push({
        t: i,
        value: parseFloat(currentValue.toFixed(3))
      });
    }
    
    seriesCounter++;
    const id = `rw_${seriesCounter}_${Math.random().toString(36).substr(2, 9)}`;
    const newSeries = {
      id: id,
      data: data,
      color: getRandomColor(),
      name: `Series ${randomWalkSeries.length + 1}`
    };
    
    console.log('Creating random walk series with ID:', id);
    setRandomWalkSeries(prev => {
      console.log('Adding to random walk series. Current count:', prev.length);
      return [...prev, newSeries];
    });
  };

  const generateCyclical = () => {
    const { amplitude, frequency, phase, noise, length } = params.cyclical;
    const data = [];
    
    for (let i = 0; i < length; i++) {
      const cyclical = amplitude * Math.sin(2 * Math.PI * frequency * i + phase);
      const value = cyclical + noise * randomNormal();
      
      data.push({
        t: i,
        value: parseFloat(value.toFixed(3))
      });
    }
    
    seriesCounter++;
    const id = `cy_${seriesCounter}_${Math.random().toString(36).substr(2, 9)}`;
    const newSeries = {
      id: id,
      data: data,
      color: getRandomColor(),
      name: `Series ${cyclicalSeries.length + 1}`
    };
    
    console.log('Creating cyclical series with ID:', id);
    setCyclicalSeries(prev => {
      console.log('Adding to cyclical series. Current count:', prev.length);
      return [...prev, newSeries];
    });
  };

  const updateParams = (type, newParams) => {
    setParams(prev => ({
      ...prev,
      [type]: { ...prev[type], ...newParams }
    }));
  };

  const removeWhiteNoiseSeries = (idToRemove) => {
    console.log('🗑️ Removing white noise series:', idToRemove);
    setWhiteNoiseSeries(currentSeries => {
      console.log('Current series before removal:', currentSeries.map(s => s.id));
      const newSeries = currentSeries.filter(series => series.id !== idToRemove);
      console.log('New series after removal:', newSeries.map(s => s.id));
      return newSeries;
    });
  };

  const removeRandomWalkSeries = (idToRemove) => {
    console.log('🗑️ Removing random walk series:', idToRemove);
    setRandomWalkSeries(currentSeries => {
      console.log('Current series before removal:', currentSeries.map(s => s.id));
      const newSeries = currentSeries.filter(series => series.id !== idToRemove);
      console.log('New series after removal:', newSeries.map(s => s.id));
      return newSeries;
    });
  };

  const removeCyclicalSeries = (idToRemove) => {
    console.log('🗑️ Removing cyclical series:', idToRemove);
    setCyclicalSeries(currentSeries => {
      console.log('Current series before removal:', currentSeries.map(s => s.id));
      const newSeries = currentSeries.filter(series => series.id !== idToRemove);
      console.log('New series after removal:', newSeries.map(s => s.id));
      return newSeries;
    });
  };

  const renderChart = (title, description, seriesList, generator, clearer, paramType) => {
    const chartData = formatChartData(seriesList);
    
    // Get the appropriate remove function
    const getRemoveFunction = () => {
      if (paramType === 'whiteNoise') return removeWhiteNoiseSeries;
      if (paramType === 'randomWalk') return removeRandomWalkSeries;
      if (paramType === 'cyclical') return removeCyclicalSeries;
      return () => console.error('Unknown param type:', paramType);
    };
    
    const removeFn = getRemoveFunction();
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generator}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              <Plus size={16} />
              Add Series
            </button>
            <button
              onClick={clearer}
              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              <RotateCcw size={16} />
              Clear All
            </button>
          </div>
        </div>
        
        <div className="h-80 mb-4 border border-gray-200 rounded bg-white">
          {seriesList.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="mb-2">No series generated yet</p>
                <p className="text-sm">Click "Add Series" to create a time series</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="t" 
                  stroke="#666"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                  formatter={(value, name) => [
                    Number(value).toFixed(3), 
                    seriesList.find(s => `series_${s.id}` === name)?.name || 'Series'
                  ]}
                />
                
                {seriesList.map((series) => (
                  <Line
                    key={series.id}
                    dataKey={`series_${series.id}`}
                    stroke={series.color}
                    strokeWidth={2}
                    dot={false}
                    name={series.name}
                  />
                ))}
                
                {paramType === 'whiteNoise' && (
                  <ReferenceLine 
                    y={params.whiteNoise.mean} 
                    stroke="#16a34a" 
                    strokeDasharray="3 3"
                    strokeWidth={1}
                    label="Mean"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Parameter Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {paramType === 'whiteNoise' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Mean (μ)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.whiteNoise.mean}
                  onChange={(e) => updateParams('whiteNoise', { mean: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Variance (σ²)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={params.whiteNoise.variance}
                  onChange={(e) => updateParams('whiteNoise', { variance: parseFloat(e.target.value) || 0.1 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Length</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={params.whiteNoise.length}
                  onChange={(e) => updateParams('whiteNoise', { length: parseInt(e.target.value) || 100 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </>
          )}
          
          {paramType === 'randomWalk' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Drift (δ)</label>
                <input
                  type="number"
                  step="0.01"
                  value={params.randomWalk.drift}
                  onChange={(e) => updateParams('randomWalk', { drift: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Variance (σ²)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={params.randomWalk.variance}
                  onChange={(e) => updateParams('randomWalk', { variance: parseFloat(e.target.value) || 0.1 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Initial Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.randomWalk.initial}
                  onChange={(e) => updateParams('randomWalk', { initial: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Length</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={params.randomWalk.length}
                  onChange={(e) => updateParams('randomWalk', { length: parseInt(e.target.value) || 100 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </>
          )}
          
          {paramType === 'cyclical' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Amplitude (A)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={params.cyclical.amplitude}
                  onChange={(e) => updateParams('cyclical', { amplitude: parseFloat(e.target.value) || 0.1 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency (ω)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="0.5"
                  value={params.cyclical.frequency}
                  onChange={(e) => updateParams('cyclical', { frequency: parseFloat(e.target.value) || 0.01 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phase (φ)</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.cyclical.phase}
                  onChange={(e) => updateParams('cyclical', { phase: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Noise (σ)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={params.cyclical.noise}
                  onChange={(e) => updateParams('cyclical', { noise: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
              </div>
            </>
          )}
        </div>
        
        {/* Series List */}
        {seriesList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {seriesList.map((series) => (
              <div key={series.id} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: series.color }}
                ></div>
                <span>{series.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    console.log('🗑️ DIRECT REMOVAL - Series:', series.id, 'Type:', paramType);
                    removeFn(series.id);
                  }}
                  className="text-red-500 hover:text-red-700 ml-1 p-1 rounded hover:bg-red-100"
                  title="Remove this series"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Series Stationarity Visualizer</h1>
        <p className="text-lg text-gray-500 mb-4">
          Created by Dr. Pedram Jahangiry | Enhanced with Claude
        </p>
        <div className="flex justify-center gap-4 mb-4">
          <a 
            href="https://pjalgotrader.github.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Website
          </a>
          <a 
            href="https://www.youtube.com/@pedramjahangiry" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube Channel
          </a>
          <a 
            href="https://github.com/PJalgotrader/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub Profile
          </a>
        </div>
        <p className="text-lg text-gray-600">
          Explore conditional expectations E[X_t | X_(t-1), X_(t-2), ...] across different time series processes
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
          <h3 className="font-semibold text-blue-900 mb-2">Usage:</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div><strong>Add Series:</strong> Click "Add Series" to generate multiple realizations of each process</div>
            <div><strong>Different Colors:</strong> Each series gets a unique color for easy identification</div>
            <div><strong>Teaching Tool:</strong> Use to manually demonstrate conditional expectations for different time horizons</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        {renderChart(
          '1. White Noise Process', 
          'E[X_t | X_(t-1), X_(t-2), ...] = E[X_t] = μ (constant for all t) → STATIONARY',
          whiteNoiseSeries,
          generateWhiteNoise,
          () => setWhiteNoiseSeries([]),
          'whiteNoise'
        )}
        
        {renderChart(
          '2. Random Walk with Drift', 
          'E[X_t | X_(t-1), X_(t-2), ...] = X_(t-1) + δ (depends on past values) → NON-STATIONARY',
          randomWalkSeries,
          generateRandomWalk,
          () => setRandomWalkSeries([]),
          'randomWalk'
        )}
        
        {renderChart(
          '3. Cyclical/Seasonal Process', 
          'E[X_t | X_(t-1), X_(t-2), ...] = A·sin(ωt + φ) (time-varying pattern) → NON-STATIONARY',
          cyclicalSeries,
          generateCyclical,
          () => setCyclicalSeries([]),
          'cyclical'
        )}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">Teaching Points:</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• <strong>White Noise:</strong> Conditional expectation is always μ regardless of conditioning set - perfectly stationary</li>
          <li>• <strong>Random Walk:</strong> Conditional expectation depends on the most recent value - non-stationary</li>
          <li>• <strong>Cyclical:</strong> Conditional expectation follows a predictable time-varying pattern - non-stationary but deterministic</li>
          <li>• <strong>Multiple Series:</strong> Generate several realizations to show the consistency of these properties across different samples</li>
        </ul>
      </div>
    </div>
  );
};

export default TimeSeriesVisualizer;